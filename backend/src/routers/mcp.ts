import { Router } from 'express'
import bodyValidation from '../middlewares/body-validation'
import { askValidator } from '../controllers/mcp/validators'
import ask from '../controllers/mcp/ask'

const mcpRouter = Router()

mcpRouter.post('/ask', bodyValidation(askValidator), ask)

export default mcpRouter
