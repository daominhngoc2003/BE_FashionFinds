import dotenv from "dotenv";
import Product from "../model/Product";
import { ProductSchema } from "../schemas/Product";
dotenv.config;

const getall = async (req, res) => {
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
    const searchData = (products) => {
      return products?.docs?.filter((item) =>
        item?.product_name?.toLowerCase().includes(_keywords)
      );
    };

    const products = await Product.paginate({}, option);

    if (!products.docs || products.docs.length == 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm",
      });
    }

    const searchDataProduct = await searchData(products);
    const productResponse = await { ...products, docs: searchDataProduct };
    console.log(productResponse);

    res.status(200).json({
      message: "Lấy thành công ",
      productResponse,
      pagination: {
        currentPage: products.page,
        totalPages: products.totalPages,
        totalItems: products.totalDocs,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};
const getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.length == 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm",
      });
    }
    res.status(200).json({
      message: "lấy sẩn phẩm thành công",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Xóa sản phẩm
    const product = await Product.findByIdAndDelete(productId);

    // Xóa sản phẩm khỏi danh mục
    await Category.findByIdAndUpdate(product.categoryId, {
      $pull: {
        products: productId,
      },
    });

    return res.json({
      message: "Xóa sản phẩm thành công!",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const createProduct = async (req, res) => {
  const { product_name } = req.body;
  try {
    const { error } = ProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const data = await Product.findOne({ product_name });
    if (data) {
      return res.status(400).json({
        message: "Sản phẩm đã tồn tại",
      });
    }

    const product = await Product.create(req.body);
    if (!product || product.length == 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm",
      });
    }
    return res.status(400).json({
      message: "thêm thành công ",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const data = await Product.findOne({ product_name });
    if (data) {
      return res.status(400).json({
        message: "Sản phẩm đã tồn tại",
      });
    }

    const { error } = ProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product || product.length == 0) {
      return res.status(400).json({
        message: "không tìm thấy sản phẩm",
      });
    }
    res.json({
      message: "Cập nhật thành công",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
export { getOne, getall, createProduct, deleteProduct, updateProduct };
