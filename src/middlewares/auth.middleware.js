import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    if(!token){
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    console.log("Login Request -> ", req);
    console.log("Original Token -> ", token);
    console.log("Decoded Token -> ", decodedToken);

    const user = await User.findById(decodedToken?._id);
    if(!user){
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;
    next()
})