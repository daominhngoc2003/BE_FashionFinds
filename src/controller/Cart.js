import Cart from "../model/Cart";
import User from "../model/User";
import Product from "../model/Product";
import Bill from "../model/Bill";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, color, size, quantity } = req.body;

    // Kiểm tra thông tin bắt buộc được cung cấp
    if (
      !userId ||
      !productId ||
      !color ||
      !size ||
      !quantity ||
      quantity <= 0
    ) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }
    // Kiểm tra xem tài khoản đã đang nhập hay chưa
    const user = await User.findById(userId);

    if (!userId || !user) {
      return res.status(404).json({
        message: "Bạn phải đăng nhập mới mua hàng.",
      });
    }
    // Nếu sản phẩm chưa tồn tại trong giỏ hàng, tìm giá tiền dựa trên productId
    const product = await Product.findById(productId);
    // Tìm sản phẩm trong giỏ hàng dựa trên userId, productId, color và size
    let cartItem = await Cart.findOne({ userId, productId, color, size });

    if (!cartItem) {
      // Nếu không tìm thấy sản phẩm, tìm sản phẩm trong giỏ hàng với cùng userId và productId nhưng khác color hoặc size
      cartItem = await Cart.findOne({ userId, productId });

      if (cartItem) {
        // Nếu đã tồn tại sản phẩm với cùng userId và productId nhưng khác color hoặc size, tạo một CartItem mới với color và size mới
        cartItem = new Cart({
          userId,
          productId,
          product_name: product.product_name,
          product_image: product.product_images,
          color,
          size,
          quantity,
          price: product.price,
        });
      } else {
        if (!product) {
          return res.status(404).json({ message: "Không có sản phẩm này!" });
        }

        // Tạo sản phẩm mới trong giỏ hàng và lấy giá tiền từ product
        cartItem = new Cart({
          userId,
          productId,
          product_name: product.product_name,
          product_image: product.product_images,
          color,
          size,
          quantity,
          price: product.product_price,
        });
      }
    } else {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
      cartItem.quantity += quantity;
    }
    // Lưu hoặc cập nhật sản phẩm vào giỏ hàng
    const savedCartItem = await cartItem.save();
    // Trả về thông tin sản phẩm đã thêm vào giỏ hàng
    res.json(savedCartItem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get  Cart items by User
export const getCartByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const carts = await Cart.find({ userId });
    if (carts.length > 0) {
      return res.status(200).json({ carts });
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await Cart.findByIdAndDelete({ _id: id });
    return res.status(200).json(cartItem);
  } catch (error) {
    return res.status(500).json({ message: "Khong xoa duoc" + error.message });
  }
};

// Hàm tính tổng giá tất cả sản phẩm trong giỏ hàng
const totalOrder = async (cart) => {
  try {
    // Tính tổng giá của giỏ hàng
    const total = cart?.products?.reduce((accumulator, product) => {
      return accumulator + product.price;
    }, 0);

    cart.totalPrice = total;
    cart.totalOrder = cart.totalPrice + cart.shippingFee;
    await cart.save();
    return cart;
  } catch (error) {
    return error.message;
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

export const deleteProductCart = async (req, res) => {
  const { productId, userId } = req.body;
  const id = req.params.id;
  try {
    // Kiêm tra xem có tài khoản người dùng k
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(400).json({ message: "Không tìm thấy đơn hàng!" });
    }

    const data = await Cart.findByIdAndDelete(productId);
    if (!data) {
      return res
        .status(400)
        .json({ message: "Xóa đơn hàng không thành công!" });
    }
    await cart.save();
    totalOrder(cart);
    return res
      .status(200)
      .json({ message: "Xóa sản phẩm trong giỏ hàng thành công!", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const data = await Cart.find({});
    return res
      .status(200)
      .json({ message: "Lấy danh sách giỏ hàng thành công!", data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleleAllProductCart = async (req, res) => {
  const { userId } = req.body;
  try {
    // Tìm kiếm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId: userId });

    // Nếu không tìm thấy giỏ hàng, trả về lỗi
    if (!cart) {
      return res.status(400).json({
        message: "Không tìm thấy giỏ hàng!",
      });
    }

    // Tìm thấy, xóa tất cả sản phẩm trong giỏ hàng
    cart.products = [];
    await cart.save();
    return res
      .status(200)
      .json({ message: "Xóa tất cả sản phẩm trong giỏ hàng thành công!" });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const checkOut = async (req, res) => {
  const { shippingAddress, userId, paymentMethod, orderNotes } = req.body;
  try {
    // Tìm kiếm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId: userId }).populate(
      "products.productId"
    );

    // Nếu không tìm thấy giỏ hàng, trả về lỗi
    if (!cart || cart.products.length === 0) {
      return res
        .status(400)
        .json({ message: "Trong giỏ hàng không có sản phẩm nào!" });
    }

    // Lấy thông tin user
    const user = await User.findById(userId);

    // Tạo bill
    const bill = await Bill.create({
      userId: userId,
      cartId: cart._id,
      totalPrice: cart.totalPrice,
      shippingFee: cart.shippingFee,
      shippingAddress: user.address || shippingAddress,
      totalOrder: cart.totalOrder,
      paymentMethod: paymentMethod,
      orderNotes: orderNotes,
      products: cart.products,
    });
    // Populate thông tin từ bảng User và Cart
    await bill.populate("userId");

    // Sau khi đã tạo bill, cập nhật trạng thái giỏ hàng và xóa giỏ hàng
    cart.totalPrice = 0;
    cart.totalOrder = 0;
    cart.products = [];
    await cart.save();

    //Sau khi tạo bill xong, thêm luôn id của bill đó vào mảng bills của User
    user.bills.push({
      billId: bill._id,
    });

    await user.save();

    return res
      .status(200)
      .json({ message: "Order placed successfully!", bill });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
