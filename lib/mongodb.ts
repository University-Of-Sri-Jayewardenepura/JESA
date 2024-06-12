import mongoose from "mongoose";

const  connectMongoDB= async ()=>{
    try{
       await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Connected to the MongoDB")
    }catch(error){
        console.log(error)
    }
}