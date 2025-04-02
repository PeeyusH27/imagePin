import express from "express";
import dotenv from 'dotenv'
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary';

//setup dot env to retrieve data
dotenv.config()

cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret
})

const app = express();
const port = process.env.PORT || 5000;

//Middleware use
app.use(express.json())
app.use(cookieParser())

//Importing ROutes
//USER ROUTES
import userRoutes from './routes/userRoutes.js'
import pinRoutes from './routes/pinRoutes.js'
app.use("/api/user", userRoutes)
app.use("/api/pin", pinRoutes)

connectDb().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error("DB Connection Failed:", error);
});