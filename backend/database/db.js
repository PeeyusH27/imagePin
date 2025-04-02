import mongoose from "mongoose";

const connectDb = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName:'imagepin',
        })
        console.log("MongoDb Connected");
    } catch (error) {
        console.log("Error:", error);
        process.exit(1);
    }
}

export default connectDb;