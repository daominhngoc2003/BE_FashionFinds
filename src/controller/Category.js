import Category from "../model/Category";
import { categorySchema } from "../schemas/Category";

export const getAllcategory = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories || categories.length == 0) {
            return res.json({
                message: "Không tìm thấy danh mục",
            });
        }
        return res.json({
            message: "Lấy danh mục thành công",
            categories,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
export const get = async (req, res) => {
    try {const category = await Category.findById(req.params.id)
        if (!category || category.length == 0 ) {
            return res.json({
                message: "Không tìm thấy danh mục",
            });
        }
        return res.json({message:"lấy danh mục thành công",category});
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const create = async (req, res) => {
    const { category_name } = req.body;
    const formData = req.body
    try {
        const data = await Category.findOne({category_name})
        if(data){
            return res.status(400).json({
                message:"danh mục đã tồn tại"
            });
        }
        // validate
        const { error } = categorySchema.validate(formData);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }
        const category = await Category.create(formData);
        console.log(category);
        if (!category || category.length == 0) {
            return res.json({
                message: "Thêm danh mục không thành công",
            });
        }
        return res.json({
            message: "Thêm danh mục thành công",
            category,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};
export const deleteCategory = async (req, res) => {
    try {const category = await Category.findByIdAndDelete(req.params.id)
        if (!category || category.length == 0 ) {
            return res.json({
                message: "Không tìm thấy danh mục",
            });
        }
        return res.json({message:"xóa danh mục thành công",category});
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
export const updateCategory = async (req, res) => {
    const {category_name} =req.body
    try {
        const data = await Category.findOne({category_name})
        if(data){
            return res.status(400).json({
                message:"danh mục đã tồn tại"
            });
        }
        const category = await Category.findByIdAndUpdate(req.params.id,req.body,{new: true})
        if (!category || category.length == 0 ) {
            return res.json({
                message: "Không tìm thấy danh mục",
            });
        }
        return res.json({message:"sửa danh mục thành công",category});
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};