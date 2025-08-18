import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { connectToSocket } from "./controllers/socketManager.js";
import userRouter from "./routes/user.routes.js";

dotenv.config({
  path: "./.env",
});

const app = express();

const server = createServer(app);
const io = connectToSocket(server);

const PORT = process.env.PORT || 8000;
app.use(express.json({ limit: "40kb" })); //to parse
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use(cors());

app.use(cookieParser());

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send(`You hit the / route`);
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
