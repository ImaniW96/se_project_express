const { Joi, celebrate } = require("celebrate");
const validator = require("validator");
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};
module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().valid("hot", "cold", "warm"),
  }),
});
module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatarUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatarUrl" field must be filled in',
      "string.uri": 'the "avatarUrl" field must be a valid url',
    }),
    email: Joi.string()
      .required()
      .email()
      .message("email must be valid")
      .messages({
        "string.empty": 'The "email" field must be filled in',
      }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});
module.exports.validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message(" email must be valid")
      .messages({
        "string.empty": 'The "email" feild needs to be filled in',
      }),
  }),
  password: Joi.string().required().messages({
    "string.empty": 'The "password" field must be filled in',
  }),
});
