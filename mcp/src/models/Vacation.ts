import { Model, DataTypes, Sequelize, Op } from 'sequelize'

export interface IVacation {
    _id: string
    destination: string
    description: string
    startDate: Date
    endDate: Date
    price: number
    imageName: string
}

export class VacationModel extends Model {
    declare id: number
    declare destination: string
    declare description: string
    declare startDate: string
    declare endDate: string
    declare price: number
    declare imageName: string
}

export function initVacationModel(sequelize: Sequelize): void {
    VacationModel.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        destination: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        startDate: { type: DataTypes.DATEONLY, allowNull: false },
        endDate: { type: DataTypes.DATEONLY, allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        imageName: { type: DataTypes.STRING(255), allowNull: false }
    }, {
        sequelize,
        modelName: 'Vacation',
        tableName: 'vacations'
    })
}

function toJSON(vacation: VacationModel): IVacation {
    const plain = vacation.get({ plain: true }) as any
    return {
        _id: String(plain.id),
        destination: plain.destination,
        description: plain.description,
        startDate: new Date(plain.startDate),
        endDate: new Date(plain.endDate),
        price: parseFloat(plain.price),
        imageName: plain.imageName
    }
}

const Vacation = {
    async findAll(): Promise<IVacation[]> {
        const vacations = await VacationModel.findAll()
        return vacations.map(toJSON)
    },

    async findByDestination(destination: string): Promise<IVacation[]> {
        const vacations = await VacationModel.findAll({
            where: { destination: { [Op.like]: `%${destination}%` } }
        })
        return vacations.map(toJSON)
    }
}

export default Vacation
