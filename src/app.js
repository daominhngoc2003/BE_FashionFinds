import express from "express";
import connectDB from "./config/database";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ProductRuoter from "./routes/Product";
import CategoryRouter from "./routes/Category";
import uploadRouter from "./routes/upload";
dotenv.config();
const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(cors());

//Router
app.use("/api", ProductRuoter);
app.use("/api", CategoryRouter);
app.use("/api", uploadRouter);

// KẾT NỐI MONGO
connectDB(process.env.MONGO_URL);

// VITENODEAPP
export const viteNodeApp = app;
