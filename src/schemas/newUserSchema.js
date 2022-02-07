import joi from "joi";

const newUserSchema = joi.object({
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .required()
    .pattern(/[a-z][A-Z][0-9]{4,8}/),
});

export default newUserSchema;
