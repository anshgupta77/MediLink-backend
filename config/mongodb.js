const MONGO_URI = process.env.MONGO_URI;
console.log(MONGO_URI);
import mongoose from 'mongoose';
const connectDb = () =>{
    mongoose.connect(MONGO_URI)
        .then(() =>console.log("Connected to the via mongoose "))
        .catch(err =>{
            console.log(err.message);
    })

}

export default connectDb;