import express, { json } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import authRouter from './routers/auth'
import vacationsRouter from './routers/vacations'
import likesRouter from './routers/likes'
import reportRouter from './routers/report'
import aiRouter from './routers/ai'
import mcpRouter from './routers/mcp'
import authEnforce from './middlewares/auth-enforce'
import notFound from './middlewares/not-found'
import logError from './middlewares/error/log-error'
import respondError from './middlewares/error/error-responder'
import connectDB from './db/mongoose'

const app = express()

app.use(morgan('dev'))
app.use('/', cors())
app.use('/', json())

// serve uploaded vacation images
app.use('/uploads', express.static('uploads'))

// public routes
app.use('/api/auth', authRouter)

// protected routes
app.use('/', authEnforce)
app.use('/', fileUpload())
app.use('/api/vacations', vacationsRouter)
app.use('/api/likes', likesRouter)
app.use('/api/report', reportRouter)
app.use('/api/ai', aiRouter)
app.use('/api/mcp', mcpRouter)

app.use('/', notFound)
app.use('/', logError)
app.use('/', respondError)

export default app

export async function init() {
    await connectDB()
}
