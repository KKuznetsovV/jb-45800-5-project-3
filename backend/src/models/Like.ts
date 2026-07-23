import { Model, DataTypes, Sequelize } from 'sequelize'

export interface ILike {
    id: number
    userId: number
    vacationId: number
}

export interface LikeInput {
    userId: number
    vacationId: number
}

export class LikeModel extends Model<ILike, LikeInput> implements ILike {
    declare id: number
    declare userId: number
    declare vacationId: number
}

export function initLikeModel(sequelize: Sequelize): void {
    LikeModel.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        vacationId: { type: DataTypes.INTEGER, allowNull: false }
    }, {
        sequelize,
        modelName: 'Like',
        tableName: 'likes',
        indexes: [{ unique: true, fields: ['userId', 'vacationId'] }]
    })
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

const Like = {
    async create(data: LikeInput): Promise<ILike> {
        try {
            const like = await LikeModel.create(data)
            return like.get({ plain: true }) as ILike
        } catch (err: any) {
            return normalizeDupError(err)
        }
    },

    // Returns true if a row was actually deleted
    async deleteOne(data: LikeInput): Promise<boolean> {
        const count = await LikeModel.destroy({ where: data as any })
        return count > 0
    },

    async deleteByVacationId(vacationId: number | string): Promise<void> {
        await LikeModel.destroy({ where: { vacationId } })
    },

    async countByVacationId(vacationId: number | string): Promise<number> {
        return LikeModel.count({ where: { vacationId } })
    }
}

export default Like
