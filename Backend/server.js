import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());


app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173", 
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" MongoDB connected"))
.catch(err => console.error(" MongoDB connection error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
