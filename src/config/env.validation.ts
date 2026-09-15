import * as joi from 'joi';

export const envValidationSchema = joi.object({
	MONGO_URI: joi.string().required(),
	JWT_ACCESS_SECRET: joi.string().min(32).required(),
	JWT_REFRESH_SECRET:joi.string().min(32).required(),
	JWT_ACCESS_EXPIRES_IN: joi.string().default('15m'),
  	JWT_REFRESH_EXPIRES_IN: joi.string().default('7d'),
  	MAIL_HOST: joi.string().required(),
  	MAIL_PORT: joi.number().required(),
  	MAIL_USER: joi.string().required(),
  	MAIL_PASS: joi.string().required(),
  	MAIL_FROM: joi.string().required(),
  	FRONTEND_URL: joi.string().required(),
});