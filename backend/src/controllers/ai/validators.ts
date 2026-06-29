import Joi from 'joi'

export const recommendValidator = Joi.object({
    destination: Joi.string().min(2).max(100).required()
})
