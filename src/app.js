import express from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";
import cors from "cors";
import ProductRuoter from "./routes/Product";
dotenv.config();
const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(cors());

//Router
app.use("/api",ProductRuoter)
// KẾT NỐI MONGO
connectDB(process.env.MONGO_URL);

// VITENODEAPP
export const viteNodeApp = app;
