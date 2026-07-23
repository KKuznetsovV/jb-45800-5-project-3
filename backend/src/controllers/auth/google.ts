import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import config from 'config'
import type { Request, Response, NextFunction } from 'express'
import User, { Role } from '../../models/User'
import { signToken } from '../../utils/jwt'

const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID     || config.get<string>('google.clientId')
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || config.get<string>('google.clientSecret')
const CALLBACK_URL  = process.env.GOOGLE_CALLBACK_URL  || config.get<string>('google.callbackUrl')
const FRONTEND_URL  = process.env.FRONTEND_URL         || config.get<string>('google.frontendUrl')

// Only register the strategy when credentials are provided
if (CLIENT_ID && CLIENT_SECRET) {
    passport.use(new GoogleStrategy(
        { clientID: CLIENT_ID, clientSecret: CLIENT_SECRET, callbackURL: CALLBACK_URL },
        async (_access, _refresh, profile, done) => {
            try {
                let user = await User.findByGoogleId(profile.id)

                if (!user) {
                    const email = profile.emails?.[0]?.value
                    // link to existing account with same email
                    if (email) user = await User.findByEmail(email)

                    if (user) {
                        await User.setGoogleId(user.id, profile.id)
                        user.googleId = profile.id
                    } else {
                        user = await User.create({
                            googleId:  profile.id,
                            firstName: profile.name?.givenName || profile.displayName,
                            lastName:  profile.name?.familyName || '',
                            email:     profile.emails?.[0]?.value ?? `${profile.id}@google.oauth`,
                            password:  null,
                            role:      Role.User,
                        })
                    }
                }

                done(null, user)
            } catch (err) {
                done(err as Error)
            }
        }
    ))
}

export function googleRedirect(req: Request, res: Response, next: NextFunction) {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        return res.status(501).json({ message: 'Google OAuth is not configured on this server.' })
    }
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next)
}

export function googleCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', { session: false }, (err: Error | null, user: any) => {
        if (err || !user) {
            return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`)
        }

        const token = signToken({ id: String(user.id), role: user.role })
        const userParam = encodeURIComponent(JSON.stringify({
            _id:       String(user.id),
            firstName: user.firstName,
            lastName:  user.lastName,
            email:     user.email,
            role:      user.role,
        }))

        res.redirect(`${FRONTEND_URL}/oauth-callback?token=${token}&user=${userParam}`)
    })(req, res, next)
}
