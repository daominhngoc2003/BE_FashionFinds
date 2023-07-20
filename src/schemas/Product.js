import Joi from "joi";

export const ProductSchema = Joi.object({
  product_name: Joi.string().required(),
  product_price: Joi.number().required(),
  product_images: Joi.string().required(),
  product_color: Joi.string().required(),
  product_size: Joi.string(),
  product_discount: Joi.number().required(),
  product_description_long: Joi.string(),
  product_description_sort: Joi.string(),
  product_quantity: Joi.number(),
  categoryId: Joi.string().required(),
});

export const ProductUpdateSchema = Joi.object({
  _id: Joi.string(),
  product_name: Joi.string().required(),
  product_price: Joi.number().required(),
  product_images: Joi.string().required(),
  product_color: Joi.string().required(),
  product_size: Joi.string(),
  product_discount: Joi.number().required(),
  product_description_long: Joi.string(),
  product_description_sort: Joi.string(),
  product_quantity: Joi.number(),
  categoryId: Joi.string().required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  slug: Joi.string(),
});
