
import mongoose,{ObjectId} from "mongoose";
const ProductSchema = new mongoose.Schema({
    product_name:{
      type:String,
      require: true
    },
    product_price:{
        type : Number,
        min: 0
    },
    product_image :{
        type : String
    },
    product_deScription:{
        type :String
    },
    product_quantity:{
        type :Number
    },
    // CategoryId:{
    //     type : mongoose.Types.ObjectId
    // }

},{timestamps:true,versionKey:false});
 
 export default mongoose.model('Product',ProductSchema)