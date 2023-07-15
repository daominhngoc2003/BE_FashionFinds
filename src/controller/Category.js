import Category from "../model/Category";
import Product from "../model/Product";
import { categorySchema } from "../schemas/Category";

export const getAllcategory = async (req, res) => {
  const {
    _page = 1,
    _limit = 10,
    _sort = "createAt",
    _order = "asc",
    _keywords = "",
  } = req.query;
  const option = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order === "desc" ? 1 : -1,
    },
  };
  try {
    // Tìm kiếm dữ liệu
    const searchData = (categories) => {
      return categories?.docs?.filter((item) =>
        item?.category_name?.toLowerCase().includes(_keywords)
      );
    };
    const categories = await Category.paginate({}, option);
    if (!categories.docs || categories.docs.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }
    const searchDataCate = await searchData(categories);
    const CategoryResponse = await { ...categories, docs: searchDataCate };

    res.status(200).json({
      message: "Lấy danh mục thành công ",
      CategoryResponse,
      pagination: {
        currentPage: categories.page,
        totalPages: categories.totalPages,
        totalItems: categories.totalDocs,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const get = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }
    return res.json({ message: "lấy danh mục thành công", category });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const create = async (req, res) => {
  const { category_name } = req.body;
  const formData = req.body;
  try {
    const data = await Category.findOne({ category_name });
    if (data) {
      return res.status(400).json({
        message: "danh mục đã tồn tại",
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
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
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
  try {
    const categoryId = req.params.id;

    // Xóa tất cả sản phẩm thuộc danh mục
    await Product.deleteMany({ categoryId });

    // Xóa danh mục
    const category = await Category.findByIdAndDelete(categoryId);

    return res.json({
      message: "Xóa danh mục thành công!",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const updateCategory = async (req, res) => {
  const { category_name } = req.body;
  try {
    const data = await Category.findOne({ category_name });
    if (data) {
      return res.status(400).json({
        message: "danh mục đã tồn tại",
      });
    }
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }
    return res.json({ message: "sửa danh mục thành công", category });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
