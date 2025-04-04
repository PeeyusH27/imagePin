import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import path from "path";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

const app = express();

const port = process.env.PORT;

const __dirname = path.resolve();
//using middlewares
app.use(express.json());
app.use(cookieParser());

// importing routes
import userRoutes from "./routes/userRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";

// using routes
app.use("/api/user", userRoutes);
app.use("/api/pin", pinRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}


connectDb().then(() => {
    try{
        app.listen(port, () => {
          console.log(`Server is running on http://localhost:${port}`);
        });
    }catch(error){
        console.log(error);
    }
})