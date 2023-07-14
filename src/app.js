import express from "express";
import connectDB from "./config/database";
import dotenv from "dotenv";
import cors from "cors";
import CategoryRouter from "./routes/Category";
dotenv.config();
const app = express();

//MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use('/api',CategoryRouter);   
// KẾT NỐI MONGO
connectDB(process.env.MONGO_URL);

// VITENODEAPP
export const viteNodeApp = app;
