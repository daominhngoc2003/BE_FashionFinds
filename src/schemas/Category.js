import joi from "joi";
export const categorySchema = joi.object({
    category_name: joi.string().required(),
    category_image: joi.string().required(),
});
