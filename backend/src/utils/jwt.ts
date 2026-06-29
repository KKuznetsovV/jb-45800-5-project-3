import { sign } from 'jsonwebtoken'
import config from 'config'

interface TokenPayload {
    id: string
    role: string
}

export function signToken(payload: TokenPayload): string {
    const key = config.get<string>('app.encryptionKey')
    // expiresIn must be a literal — reading from config returns plain string
    // which conflicts with the branded StringValue type in @types/jsonwebtoken
    const expiry = config.get<string>('app.tokenExpiry')
    return sign(payload, key, { expiresIn: expiry as `${number}d` })
}
