import { Router } from 'express'
import roleEnforce from '../middlewares/role-enforce'
import getReport from '../controllers/report/get-report'
import getCsv    from '../controllers/report/get-csv'

const reportRouter = Router()

reportRouter.use(roleEnforce('admin'))

reportRouter.get('/csv', getCsv)
reportRouter.get('/',    getReport)

export default reportRouter
