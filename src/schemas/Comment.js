import joi from "joi";
export const commentSchema = joi.object({
  userId: joi.string().required(),
  rating: joi.number().required(),
  review: joi.string().required(),
  productId: joi.string().required(),
});
