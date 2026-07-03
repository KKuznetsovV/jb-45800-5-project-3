import express, { json } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import passport from 'passport'
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
import { initBucket } from './utils/image-handler'
import serveImage from './controllers/images/serve'

const app = express()

app.use(morgan('dev'))
app.use('/', cors())
app.use('/', json())
app.use(passport.initialize())

// proxy vacation images from MinIO
app.get('/uploads/:imageName', serveImage)

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
    await initBucket()
}
