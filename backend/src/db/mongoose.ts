import mongoose from 'mongoose'
import config from 'config'

export default async function connectDB() {
    const uri = config.get<string>('db.uri')
    await mongoose.connect(uri)
    console.log('MongoDB connected')
}
