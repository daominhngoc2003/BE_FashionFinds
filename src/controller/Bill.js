import Bill from "../model/Bill";

// GET ALL BILL
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find({})
      .populate("products.productId")
      .populate("userId");

    if (bills.length === 0) {
      return res.status(400).json({
        message: "Không có hóa đơn nào!",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách hóa đơn thành công!",
      bills,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET BILL BY USER
export const getBillByUser = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const bills = await Bill.find({ userId })
      .populate("products.productId")
      .populate("userId");
    if (bills.length === 0) {
      return res.status(400).json({
        message: "Không có hóa đơn nào!",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách hóa đơn thành công!",
      bills,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET ONE BILL
export const getOneBill = async (req, res) => {
  const { billId } = req.params;
  try {
    const bill = await Bill.findById(billId)
      .populate("products.productId")
      .populate("userId");

    if (!bill) {
      return res.status(400).json({
        message: "Không tìm thấy hóa đơn!",
      });
    }

    return res.status(200).json({
      message: "Lấy hóa đơn thành công!",
      bill,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE STATUS BILL
export const updateBill = async (req, res) => {
  const { billId } = req.params;
  const { status, paymentStatus } = req.body;
  try {
    // Tìm kiếm bill cần cập nhật
    const bill = await Bill.findById(billId);

    if (!bill) {
      return res.status(400).json({
        message: "Không tìm thấy hóa đơn!",
      });
    }

    if (status) {
      bill.status = status;
    }

    if (paymentStatus) {
      bill.paymentStatus = paymentStatus;
    }

    await bill.save();

    res
      .status(200)
      .json({ message: "Hóa đơn đã được cập nhật thành công!", bill });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
