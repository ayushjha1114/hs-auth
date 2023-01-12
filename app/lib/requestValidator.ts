const Joi = require('joi');

const validation = {
  loginUser: Joi.object({
      mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
      password: Joi.string().min(6).max(50).required()
    }),
  createUser: Joi.object({
      first_name: Joi.string().max(50).required(),
      email: Joi.string().regex(/^[\w.]+@[\w]+?(\.[a-zA-Z]{2,3}){1,3}$/).required(),
      password: Joi.string().min(6).max(50).required(),
      mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
      role: Joi.string().valid('ADMIN', 'USER', 'ADMIN', 'ENGINEER').required(),
      middle_name: Joi.string(),
      last_name: Joi.string(),
      date_of_birth: Joi.string(),
      gender:  Joi.string().valid('male', 'female', 'other'),
      aadhaar_number: Joi.string().length(12).pattern(/^[0-9]+$/),
      current_address: Joi.string(),
      permanent_address: Joi.string(),
      current_state: Joi.string(),
      current_city: Joi.string(),
      current_pincode: Joi.string(),
      permanent_state: Joi.string(),
      permanent_city: Joi.string(),
      permanent_pincode: Joi.string(),
    }),
};
export default validation
