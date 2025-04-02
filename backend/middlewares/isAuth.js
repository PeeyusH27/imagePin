import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token)
            return res.status(403).json({
                message: "Please Login",
            });

        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodedData)
            return res.status(403).json({
                message: "token expired",
            });

        req.user = await User.findById(decodedData.id)
        //IF EVERY EDGE CASE PASSED, EXIT THE FUNCTION USING NEXT
        next();
    } catch (error) {
        res.status(500).json({
            message: "Please Login",
        });
    }
};