import { Router } from 'express'
import bodyValidation from '../middlewares/body-validation'
import roleEnforce from '../middlewares/role-enforce'
import { addVacationValidator, updateVacationValidator } from '../controllers/vacations/validators'
import getAll  from '../controllers/vacations/get-all'
import getOne  from '../controllers/vacations/get-one'
import add     from '../controllers/vacations/add'
import update  from '../controllers/vacations/update'
import remove  from '../controllers/vacations/remove'

const vacationsRouter = Router()

// Any logged-in user
vacationsRouter.get('/',    getAll)
vacationsRouter.get('/:id', getOne)

// Admin only
vacationsRouter.post(  '/',    roleEnforce('admin'), bodyValidation(addVacationValidator),    add)
vacationsRouter.put(   '/:id', roleEnforce('admin'), bodyValidation(updateVacationValidator), update)
vacationsRouter.delete('/:id', roleEnforce('admin'), remove)

export default vacationsRouter
