import { Router } from 'express'
import bodyValidation from '../middlewares/body-validation'
import { registerValidator, loginValidator } from '../controllers/auth/validators'
import register from '../controllers/auth/register'
import login from '../controllers/auth/login'
import { googleRedirect, googleCallback } from '../controllers/auth/google'

const authRouter = Router()

authRouter.post('/register', bodyValidation(registerValidator), register)
authRouter.post('/login',    bodyValidation(loginValidator),    login)
authRouter.get('/google',          googleRedirect)
authRouter.get('/google/callback', googleCallback)

export default authRouter
