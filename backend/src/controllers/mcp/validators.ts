import Joi from 'joi'

export const askValidator = Joi.object({
    question: Joi.string().min(5).max(500).required()
})
