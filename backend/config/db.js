import mongoose from "mongoose";
const uri = "mongodb+srv://rulangde:B94YAYXTp3mgB91K@cluster0.n1gzbnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


const connectDB = () => {

    try {
        mongoose.connect(uri).then(() => {
            console.log("mongoose connected succesfully");
        })
    }
    catch(err){
        console.error("mongoose connected unsuccesfully", err);
        process.exit(1);
        
    }
  
}

export default connectDB;

