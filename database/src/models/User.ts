import { Schema, model } from 'mongoose'

export enum Role {
    User = 'user',
    Admin = 'admin'
}

export interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
    role: Role
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true, maxlength: 30 },
    lastName:  { type: String, required: true, maxlength: 30 },
    email:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: Object.values(Role), default: Role.User }
}, { timestamps: true })

export default model<IUser>('User', userSchema)
