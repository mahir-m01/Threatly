import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;


// This is to prevent multiple connections in development

let cached = global.mongooseCache;

if(!cached) {
    cached = global.mongooseCache = { connection: null, promise: null };
}

export const connectToDatabase = async () => {
    if(!MONGODB_URI) {
        throw new Error("MongoDB URI must be defined in environment variables");
    }
    if(cached.connection) {
        return cached.connection;
    }
    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands: false});
    }
    try{
        cached.connection = await cached.promise;
    }catch(err){
        cached.promise = null;
        throw err;
    }
    console.log(`Connected to database ${process.env.NODE_ENV} ${MONGODB_URI}`);
}