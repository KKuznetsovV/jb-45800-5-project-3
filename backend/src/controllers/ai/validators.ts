import Joi from 'joi'

export const recommendValidator = Joi.object({
    destination: Joi.string().min(2).max(100).required().messages({
        'any.required':   'Destination is required',
        'string.empty':   'Destination cannot be empty',
        'string.min':     'Destination must be at least 2 characters',
        'string.max':     'Destination must be at most 100 characters',
        'string.base':    'Destination must be a string'
    })
})
