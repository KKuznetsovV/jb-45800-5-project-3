import Joi from 'joi'

export const addVacationValidator = Joi.object({
    destination: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    startDate:   Joi.date().min('now').required(),
    endDate:     Joi.date().greater(Joi.ref('startDate')).required(),
    price:       Joi.number().min(0).max(10000).required()
})

// For editing: startDate has no min restriction (can edit past vacations)
export const updateVacationValidator = Joi.object({
    destination: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    startDate:   Joi.date().required(),
    endDate:     Joi.date().greater(Joi.ref('startDate')).required(),
    price:       Joi.number().min(0).max(10000).required()
})
