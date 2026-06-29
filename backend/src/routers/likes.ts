import { Router } from 'express'
import like   from '../controllers/likes/like'
import unlike from '../controllers/likes/unlike'

const likesRouter = Router()

likesRouter.post(  '/:vacationId', like)
likesRouter.delete('/:vacationId', unlike)

export default likesRouter
