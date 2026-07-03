import { Schema, model } from 'mongoose'

export interface IVacation {
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
    startDate:   { type: Date, required: true },
    endDate:     { type: Date, required: true },
    price:       { type: Number, required: true, min: 0, max: 10000 },
    imageName:   { type: String, required: true }
}, { timestamps: true })

export default model<IVacation>('Vacation', vacationSchema)
