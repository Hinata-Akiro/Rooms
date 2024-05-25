import * as Joi from 'joi';

export const envValidator = Joi.object({
  DATABASE_URL: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
});
