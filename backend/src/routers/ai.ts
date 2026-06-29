import { Router } from 'express'
import bodyValidation from '../middlewares/body-validation'
import { recommendValidator } from '../controllers/ai/validators'
import recommend from '../controllers/ai/recommend'

const aiRouter = Router()

aiRouter.post('/recommend', bodyValidation(recommendValidator), recommend)

export default aiRouter
