import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();

// Apply middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Apply routes - make sure this is correct
app.use("/api/auth", authRoutes);

export default app;