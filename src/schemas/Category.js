import joi from "joi";
export const categorySchema = joi.object({
  category_name: joi.string().required(),
  category_images: joi.string().required(),
});
export const categoryUpdateSchema = joi.object({
  category_name: joi.string().required(),
  category_images: joi.string().required(),
  createdAt: joi.date(),
});
