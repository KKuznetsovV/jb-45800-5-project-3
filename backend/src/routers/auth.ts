import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import bodyValidation from '../middlewares/body-validation'
import { registerValidator, loginValidator } from '../controllers/auth/validators'
import register from '../controllers/auth/register'
import login from '../controllers/auth/login'
import { googleRedirect, googleCallback } from '../controllers/auth/google'

const authRouter = Router()

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
})

authRouter.post('/register', bodyValidation(registerValidator), register)
authRouter.post('/login',    loginLimiter, bodyValidation(loginValidator), login)
authRouter.get('/google',          googleRedirect)
authRouter.get('/google/callback', googleCallback)

export default authRouter
