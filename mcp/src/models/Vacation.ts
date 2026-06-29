import mongoose, { Schema, Document } from 'mongoose'

export interface IVacation extends Document {
    destination: string
    description: string
    startDate: Date
    endDate: Date
    price: number
    imageName: string
}

const vacationSchema = new Schema<IVacation>({
    destination: { type: String, required: true },
    description: { type: String, required: true },
    startDate:   { type: Date,   required: true },
    endDate:     { type: Date,   required: true },
    price:       { type: Number, required: true },
    imageName:   { type: String, required: true }
})

export default mongoose.model<IVacation>('Vacation', vacationSchema)
