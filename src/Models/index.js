import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

try {
    mongoose.connect(`${process.env.DbUrl}/${process.env.DbName}`)
} catch (error) {
    console.log(error);
}

export default mongoose