import { Sequelize } from 'sequelize'
import { initUserModel, UserModel } from './User'
import { initVacationModel, VacationModel } from './Vacation'
import { initLikeModel, LikeModel } from './Like'

let initialized = false

// Models are initialized lazily (called from db/sequelize.ts's connectDB, or
// directly from db/schema.ts in tests) rather than at module-import time, so
// the connection URI can be resolved after tests provision an ephemeral
// database and set VACATIONS_MYSQL_URI.
export function initModels(sequelize: Sequelize): void {
    if (initialized) return

    initUserModel(sequelize)
    initVacationModel(sequelize)
    initLikeModel(sequelize)

    LikeModel.belongsTo(UserModel, { foreignKey: 'userId', onDelete: 'CASCADE' })
    LikeModel.belongsTo(VacationModel, { foreignKey: 'vacationId', onDelete: 'CASCADE' })
    UserModel.hasMany(LikeModel, { foreignKey: 'userId' })
    VacationModel.hasMany(LikeModel, { foreignKey: 'vacationId' })

    initialized = true
}
