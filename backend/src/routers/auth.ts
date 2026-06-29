import { Router } from 'express'
import bodyValidation from '../middlewares/body-validation'
import { registerValidator, loginValidator } from '../controllers/auth/validators'
import register from '../controllers/auth/register'
import login from '../controllers/auth/login'

const authRouter = Router()

authRouter.post('/register', bodyValidation(registerValidator), register)
authRouter.post('/login',    bodyValidation(loginValidator),    login)

export default authRouter
