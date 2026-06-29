import Joi from 'joi'

export const askValidator = Joi.object({
    question: Joi.string().min(5).max(500).required().messages({
        'any.required':   'Question is required',
        'string.empty':   'Question cannot be empty',
        'string.min':     'Question must be at least 5 characters',
        'string.max':     'Question must be at most 500 characters',
        'string.base':    'Question must be a string'
    })
})
