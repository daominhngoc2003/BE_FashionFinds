import express from "express";

import { authorization } from "../middleware/Authorization.js";
import { authenticate } from "../middleware/Authenticate.js";
import {
  checkOut,
  deleteBillById,
  getAllBills,
  getBillByUser,
  getOneBill,
  updateBill,
} from "../controller/Bill.js";
const router = express.Router();
router.post("/bills/checkout", checkOut);
router.get("/bills", authenticate, getAllBills);
router.get("/bills/user/:userId", authenticate, getBillByUser);
router.get("/bills/:billId", authenticate, getOneBill);
router.delete("/bills/delete/:id", authenticate, deleteBillById);
router.put("/bills/update/:billId", authenticate, authorization, updateBill);
export default router;
