import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import path from "path"

import {errorHandler} from "./middlewares/error-handler.js";
import user_router from "./routes/userRoutes.js";
import work_router from "./routes/workingHoursRoutes.js";

import connectDB from "./config/db.js"
import item_router from "./routes/itemRoutes.js";

const app = express()

// const __dirname = path.resolve()

dotenv.config({path: "./config/config.env"});

connectDB().then()

app.use(morgan("dev"))
app.use(cors())
app.use(express.json());

// app.use("/public", express.static(path.join(__dirname, "public")))

app.use(errorHandler)
app.use("/api/users", user_router)
app.use("/api/users", work_router)
app.use("/api/items", item_router)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server starting at PORT ${PORT}`)
})