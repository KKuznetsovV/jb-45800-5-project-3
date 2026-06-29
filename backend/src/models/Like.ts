import { Schema, model, Types } from 'mongoose'

export interface ILike {
    userId: Types.ObjectId
    vacationId: Types.ObjectId
}

const likeSchema = new Schema<ILike>({
    userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vacationId: { type: Schema.Types.ObjectId, ref: 'Vacation', required: true }
}, { timestamps: true })

// ensure a user can only like a vacation once
likeSchema.index({ userId: 1, vacationId: 1 }, { unique: true })

export default model<ILike>('Like', likeSchema)
