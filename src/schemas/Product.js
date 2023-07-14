import Joi from "joi";

export const ProductSchema = Joi.object({
  product_name: Joi.string().required(),
  product_price: Joi.string().required(),
  product_images: Joi.string().required(),
  product_description: Joi.string(),
  product_quantity: Joi.number(),
  categoryId: Joi.string().required(),
});
