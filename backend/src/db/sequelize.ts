import { Sequelize } from 'sequelize'
import config from 'config'
import { initModels } from '../models'

let sequelize: Sequelize | null = null

function buildSequelize(): Sequelize {
    const uri = process.env.VACATIONS_MYSQL_URI || config.get<string>('db.uri')
    return new Sequelize(uri, {
        dialect: 'mysql',
        logging: false
    })
}

// Lazily created so the connection URI can be resolved at first-use time
// rather than at module-import time (needed so tests can point at a
// dynamically-provisioned test database before any query is issued).
export function getSequelize(): Sequelize {
    if (!sequelize) sequelize = buildSequelize()
    return sequelize
}

export async function closeSequelize(): Promise<void> {
    if (sequelize) {
        await sequelize.close()
        sequelize = null
    }
}

export default async function connectDB(): Promise<void> {
    const instance = getSequelize()
    await instance.authenticate()
    initModels(instance)
    console.log('MySQL connected (Sequelize)')
}
