import dotenv from "dotenv";
import User from "../model/User";

dotenv.config();

export const getAllUser = async (req, res) => {
  try {
    const user = await User.find();

    if (!user) {
      return res.status(401).json({
        message: "không tìm thấy tài khoản nào",
      });
    }
    const totalUser = await User.count();
    return res.status(200).json({
      success: true,
      user,
      totalUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
    }
    return res.status(200).json({
      user,
      message: "Lấy sản phẩm thành công",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const formData = req.body;
  const { email } = req.body;
  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail && checkEmail._id !== id) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại",
      });
    }
    const user = await User.findByIdAndUpdate(id, formData);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
    }
    return res.status(200).json({
      message: "Cập nhật tài khoản thành công",
      user,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const removeUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
    }
    return res.json({
      message: "Xoá tài khoản thành công",
      user,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
