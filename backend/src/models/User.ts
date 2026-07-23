import { Model, DataTypes, Sequelize } from 'sequelize'

export enum Role {
    User = 'user',
    Admin = 'admin'
}

export interface IUser {
    id: number
    firstName: string
    lastName: string
    email: string
    password: string | null
    googleId: string | null
    role: Role
}

export interface UserInput {
    firstName: string
    lastName: string
    email: string
    password?: string | null
    googleId?: string | null
    role?: Role
}

export class UserModel extends Model<IUser, UserInput> implements IUser {
    declare id: number
    declare firstName: string
    declare lastName: string
    declare email: string
    declare password: string | null
    declare googleId: string | null
    declare role: Role
}

export function initUserModel(sequelize: Sequelize): void {
    UserModel.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        firstName: { type: DataTypes.STRING(30), allowNull: false },
        lastName: { type: DataTypes.STRING(30), allowNull: false },
        email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
        password: { type: DataTypes.STRING(255), allowNull: true },
        googleId: { type: DataTypes.STRING(255), allowNull: true },
        role: { type: DataTypes.ENUM(...Object.values(Role)), allowNull: false, defaultValue: Role.User }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        indexes: [{ fields: ['googleId'] }]
    })
}

function toPlain(user: UserModel): IUser {
    return user.get({ plain: true }) as IUser
}

// Normalize Sequelize's unique-constraint error to the same shape the
// controllers already check for (`err.code === 'ER_DUP_ENTRY'`), matching
// the raw mysql2 driver's error code.
function normalizeDupError(err: any): never {
    if (err.name === 'SequelizeUniqueConstraintError') {
        throw Object.assign(new Error(err.message), { code: 'ER_DUP_ENTRY' })
    }
    throw err
}

export function toJSON(user: IUser) {
    return {
        _id: String(user.id),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
    }
}

const User = {
    async create(data: UserInput): Promise<IUser> {
        try {
            const user = await UserModel.create(data)
            return toPlain(user)
        } catch (err: any) {
            return normalizeDupError(err)
        }
    },

    async findById(id: number | string): Promise<IUser | null> {
        const user = await UserModel.findByPk(id)
        return user ? toPlain(user) : null
    },

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ where: { email } })
        return user ? toPlain(user) : null
    },

    async findByGoogleId(googleId: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ where: { googleId } })
        return user ? toPlain(user) : null
    },

    async setGoogleId(id: number, googleId: string): Promise<void> {
        await UserModel.update({ googleId }, { where: { id } })
    }
}

export default User
