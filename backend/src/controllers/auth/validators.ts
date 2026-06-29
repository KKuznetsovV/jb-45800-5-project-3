import Joi from 'joi'

export const registerValidator = Joi.object({
    firstName: Joi.string().min(1).max(30).required(),
    lastName:  Joi.string().min(1).max(30).required(),
    email:     Joi.string().email({ tlds: { allow: false } }).required(),
    password:  Joi.string().min(4).required()
})

export const loginValidator = Joi.object({
    email:    Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(4).required()
})
