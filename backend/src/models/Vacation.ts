import { Model, DataTypes, Sequelize } from 'sequelize'

export interface IVacation {
    id: number
    destination: string
    description: string
    startDate: Date
    endDate: Date
    price: number
    imageName: string
}

export interface VacationInput {
    destination: string
    description: string
    startDate: string | Date
    endDate: string | Date
    price: number
    imageName: string
}

export class VacationModel extends Model<IVacation, VacationInput> implements IVacation {
    declare id: number
    declare destination: string
    declare description: string
    declare startDate: Date
    declare endDate: Date
    declare price: number
    declare imageName: string
}

export function initVacationModel(sequelize: Sequelize): void {
    VacationModel.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        destination: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            get(): Date {
                const value = this.getDataValue('startDate') as unknown as string
                return new Date(value)
            }
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            get(): Date {
                const value = this.getDataValue('endDate') as unknown as string
                return new Date(value)
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            get(): number {
                return parseFloat(this.getDataValue('price') as unknown as string)
            }
        },
        imageName: { type: DataTypes.STRING(255), allowNull: false }
    }, {
        sequelize,
        modelName: 'Vacation',
        tableName: 'vacations'
    })
}

function toPlain(vacation: VacationModel): IVacation {
    return vacation.get({ plain: true }) as IVacation
}

export function toJSON(vacation: IVacation) {
    return {
        _id: String(vacation.id),
        destination: vacation.destination,
        description: vacation.description,
        startDate: vacation.startDate,
        endDate: vacation.endDate,
        price: vacation.price,
        imageName: vacation.imageName
    }
}

const Vacation = {
    async create(data: VacationInput): Promise<IVacation> {
        const vacation = await VacationModel.create(data)
        return toPlain(vacation)
    },

    async findById(id: number | string): Promise<IVacation | null> {
        const vacation = await VacationModel.findByPk(id)
        return vacation ? toPlain(vacation) : null
    },

    async update(id: number | string, data: Partial<VacationInput>): Promise<IVacation | null> {
        if (Object.keys(data).length) {
            await VacationModel.update(data as any, { where: { id } })
        }
        return Vacation.findById(id)
    },

    async deleteById(id: number | string): Promise<void> {
        await VacationModel.destroy({ where: { id } })
    }
}

export default Vacation
