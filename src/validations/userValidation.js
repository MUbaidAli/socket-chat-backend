const Joi = require('joi');

const userSchema = Joi.object({
    

        username: Joi.string()
        .required()
        .min(5)
    .max(30)
    .label('Username')
    .messages({
      'string.base': '{#label} must be a text string.',
      'string.empty': '{#label} cannot be left blank.',
      'string.min': '{#label} must have at least {#limit} characters.',
      'string.max': '{#label} cannot exceed {#limit} characters.',
      'any.required': '{#label} is a required field.'
    }),

  password: Joi.string()
    .min(6)
    .required()
    .label('Password')
    .messages({
      'string.base': '{#label} must be a valid text string.',
      'string.empty': '{#label} cannot be left blank.',
      'string.min': '{#label} must be at least {#limit} characters long.',
      'any.required': '{#label} is required.'
    }),

  email: Joi.string()
    .email()
    .required()
    .label('Email Address')
    .messages({
      'string.base': '{#label} must be a valid text string.',
      'string.empty': '{#label} cannot be left blank.',
      'string.email': 'Please enter a valid {#label}.',
      'any.required': '{#label} is a required field.'
    }),

  profileUrl: Joi.string()
    .uri() // Added .uri() as it ensures the input is a valid URL structure
    .label('Profile URL')
    .messages({
      'string.base': '{#label} must be a valid text string.',
      'string.uri': 'Please provide a valid link format for your {#label}.'
    }),
    
});







// login


const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .label('Email Address')
    .messages({
      'string.base': '{#label} must be a valid text string.',
      'string.empty': '{#label} cannot be left blank.',
      'string.email': 'Please enter a valid {#label}.',
      'any.required': '{#label} is a required field.'
    }),

  password: Joi.string()
    .required()
    .label('Password')
    .messages({
      'string.base': '{#label} must be a valid text string.',
      'string.empty': '{#label} cannot be left blank.',
      'any.required': '{#label} is required.'
    })
});



module.exports = {userSchema ,loginSchema}