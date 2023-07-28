import Cart from "../model/Cart";
import User from "../model/User";
import Product from "../model/Product";

export const addToCart = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  try {
    // Kiểm tra xem sản phẩm có tồn tại hay k thì mới được thêm sản phẩm vào giỏ hàng
    const productID = await Product.findById(productId);
    if (!productID) {
      return res.status(400).json({ message: "Sản phẩm không tồn tại!" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      await Cart.create({
        userId,
        products: [],
        shippingFee: 10,
        coupon: "FS_DMN2003",
      });

      // Cập nhật id của cart bên bảng User
      await User.findByIdAndUpdate(userId, { cartId: cart._id });
    }
    console.log(cart);
    // Check xem có sản phẩm trong giỏ hàng chưa
    const productExist = cart.products.find(
      (product) => product.productId == productId
    );

    // Nếu chưa có sản phẩm thì thêm mới
    if (!productExist) {
      const product = await Product.findById(productId);
      cart.products.push({
        productId: product._id,
        quantity: quantity,
        price: product.product_price * quantity,
      });
    } else {
      // Ngược lại nếu đã có sản phẩm trong giỏ hàng thì chỉ cập nhật số lượng
      if (quantity === 1) {
        productExist.quantity++;
      } else {
        productExist.quantity += quantity;
      }
      const getProductPrice = await Product.findById(productId).select(
        "product_price"
      );
      productExist.price =
        getProductPrice.product_price * productExist.quantity;
    }
    // Lưu giỏ hàng
    await cart.save();
    totalOrder(cart);
    return res
      .status(200)
      .json({ message: "Sản phẩm đã được thêm vào giỏ hàng!", cart });
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hàm tính tổng giá tất cả sản phẩm trong giỏ hàng
export const totalOrder = async (cart) => {
  try {
    const total = cart.products.reduce((accumulator, product) => {
      return accumulator + product.price;
    }, 0);
    cart.totalPrice = total;
    cart.totalOrder = cart.totalPrice + cart.shippingFee;
    await cart.save();
    return cart;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    // Kiểm tra user đang thực hiện đã có giỏ hàng chưa
    const cart = await Cart.findOne({ userId });

    // Nếu không tìm thấy giỏ hàng, trả về lỗi
    if (!cart) {
      return res.status(400).json({ message: "Không tìm thấy giỏ hàng!" });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa so sánh id trong giỏ hàng với productid gửi lên
    const product = cart.products.find((product) =>
      product.productId.equals(productId)
    );
    if (!product) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng!" });
    }
    // Cập nhật số lượng sản phẩm
    product.quantity = quantity;

    // Cập nhật lại giá sản phẩm theo số lượng
    const getProductPrice = await Product.findById(productId).select(
      "product_price"
    );
    product.price = getProductPrice.product_price * quantity;

    await cart.save();

    // Tính lại tổng đơn hàng cần thanh toán
    totalOrder(cart);

    // Sau khi thành công thì trả về
    return res
      .status(200)
      .json({ message: "Giỏ hàng đã được sửa đổi thành công!", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
