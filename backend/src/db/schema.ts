import { getSequelize } from './sequelize'
import { initModels } from '../models'

// Idempotent schema creation used only by the test suite (spins up an
// ephemeral MySQL container per test file). In Docker Compose, the schema
// is created by the standalone `seeder` service (see database/src/seed.ts)
// before the backend ever starts — keep both sets of Sequelize model
// definitions in sync.
export async function initSchema(): Promise<void> {
    const sequelize = getSequelize()
    initModels(sequelize)
    await sequelize.sync()
}
