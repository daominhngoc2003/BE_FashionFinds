// controllers/cartController.js
import User from "../model/User";
import Product from "../model/Product";
import CartItem from "../model/CartItem";
import Cart from "../model/Cart";
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

    // Kiểm tra xem tài khoản đã đăng nhập hay chưa
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Bạn phải đăng nhập mới mua hàng.",
      });
    }

    // Nếu sản phẩm chưa tồn tại trong giỏ hàng, tìm giá tiền dựa trên productId
    // Tìm sản phẩm trong cơ sở dữ liệu dựa trên productId để lấy thông tin giá
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Không có sản phẩm này!" });
    }

    // Tìm hoặc tạo mới Cart dựa trên userId
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
      });
    }

    // Tìm hoặc tạo mới CartItem dựa trên userId, productId, color và size
    let cartItem = await CartItem.findOne({
      cartId: cart._id,
      productId,
      color,
      size,
    });

    if (!cartItem) {
      // Tạo mới CartItem và gán giá sản phẩm từ product
      cartItem = new CartItem({
        cartId: cart._id,
        userId,
        productId,
        product_name: product.product_name,
        product_image: product.product_images,
        color,
        size,
        quantity,
        price: product.product_price, // Gán giá sản phẩm từ product vào trường price của CartItem
      });

      // Lưu CartItem vào cơ sở dữ liệu
      await cartItem.save();

      // Thêm CartItem vào mảng items của Cart
      cart.items.push(cartItem);
    } else {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
      cartItem.quantity += quantity;

      // Lưu hoặc cập nhật CartItem
      await cartItem.save();
    }

    // Lưu hoặc cập nhật Cart
    await cart.save();

    // Trả về thông tin sản phẩm đã thêm vào giỏ hàng và tổng tiền
    res.json({ cart, message: "Thêm giỏ hàng thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message + "Internal server error." });
  }
};

// Get  Cart items by User
export const getCartByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    // Tìm giỏ hàng của người dùng dựa trên userId
    const cart = await Cart.findOne({ userId }).populate("items");

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giỏ hàng của người dùng." });
    }
    // Kiểm tra xem 'items' có tồn tại trong 'cart' hay không
    if (!cart.items || cart.items.length === 0) {
      return res
        .status(404)
        .json({ message: "Giỏ hàng của người dùng không có sản phẩm nào." });
    }
    // Lấy danh sách các sản phẩm trong giỏ hàng
    const itemsInCart = cart.items;
    // Lấy danh sách các itemId từ các sản phẩm trong giỏ hàng
    const itemIds = itemsInCart.map((item) => item._id);
    // Sử dụng danh sách itemIds để lấy tất cả các CartItem
    const carts = await CartItem.find({ _id: { $in: itemIds } });
    // Trả về danh sách sản phẩm đã mua của người dùng
    if (carts.length > 0) {
      return res.status(200).json({ carts, message: "Get All Cart by User" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

export const deleteCartItem = async (req, res) => {
  const _id = req.params.id;
  try {
    const cartItem = await CartItem.findById({ _id: _id });
    const cart = await Cart.findById({ _id: cartItem.cartId });
    // Kiểm tra xem giỏ hàng có tồn tại hay không
    if (!cart) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy giỏ hàng của người dùng." });
    }
    // Loại bỏ _id của CartItem đã xóa khỏi mảng items trong giỏ hàng
    cart.items = cart.items.filter((item) => item.toString() !== _id);
    // Xóa CartItem từ cơ sở dữ liệu dựa vào _id
    const deletedCartItem = await CartItem.findByIdAndRemove(_id);
    await cart.save();
    return res
      .status(200)
      .json({ cart: deletedCartItem, message: "Xóa sản phẩm này thành công" });
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
