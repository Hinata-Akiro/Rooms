import * as Joi from 'joi';

export const envValidator = Joi.object({
  DATABASE_URL: Joi.string().required(),
});
