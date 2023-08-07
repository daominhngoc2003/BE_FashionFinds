import joi, { object } from "joi";
export const categorySchema = joi.object({
  category_name: joi.string().required(),
  category_images: joi.string().required(),
});

export const categoryUpdateSchema = joi.object({
  _id: joi.string(),
  category_name: joi.string(),
  category_images: joi.string(),
  createdAt: joi.date(),
  updateAt: joi.date(),
  products: joi.array(),
  updatedAt: joi.date(),
  slug: joi.string(),
});
