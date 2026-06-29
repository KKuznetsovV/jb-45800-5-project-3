import { Router } from 'express'

const vacationsRouter = Router()

// GET    /api/vacations        - get all (paginated, filtered)
// GET    /api/vacations/:id    - get one
// POST   /api/vacations        - admin: add
// PUT    /api/vacations/:id    - admin: edit
// DELETE /api/vacations/:id    - admin: delete

export default vacationsRouter
