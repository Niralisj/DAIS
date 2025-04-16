// server/middleware/authValidation.js
const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            'string.base': `"name" should be a type of 'text'`,
            'string.empty': `"name" cannot be an empty field`,
            'string.min': `"name" should have a minimum length of {#limit}`,
            'any.required': `"name" is a required field`
        }),
        email: Joi.string().email().required().messages({
            'string.email': `"email" must be a valid email`,
            'any.required': `"email" is a required field`
        }),
        password: Joi.string().min(4).max(100).required().messages({
            'string.min': `"password" should have a minimum length of {#limit}`,
            'any.required': `"password" is a required field`
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false }); // Show all errors
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message,
            field: detail.context.key
        }));
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': `"email" must be a valid email`,
            'any.required': `"email" is a required field`
        }),
        password: Joi.string().required().messages({ // No min length check on login usually
            'any.required': `"password" is a required field`
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
             message: detail.message,
             field: detail.context.key
        }));
        return res.status(400).json({ message: 'Validation failed', errors });
    }
    next();
};

// Optional: Add validation for category creation if needed
const addCategoryValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required().trim().messages({
             'string.min': `"name" should have a minimum length of {#limit}`,
             'string.max': `"name" should have a maximum length of {#limit}`,
             'any.required': `"name" is a required field`
        })
    });
     const { error } = schema.validate(req.body);
     if (error) {
         const errors = error.details.map(detail => ({
             message: detail.message,
             field: detail.context.key
         }));
         return res.status(400).json({ message: 'Validation failed', errors });
     }
     next();
};


module.exports = {
    signupValidation,
    loginValidation,
    addCategoryValidation 
};