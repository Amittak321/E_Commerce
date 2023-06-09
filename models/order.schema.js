import mongoose from "mongoose";
import OrderRoles from "../utils/orederRoles";

const orderSchema = new mongoose.Schema({
    products :{
        type : [
            {
                productId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"Prodcut",
                    required: true
                },
                count: Number,
                price: Number
            }
        ], 
        required: true
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    address :{
        type: String,
        required: true
    },
    phoneNumber:{
        type: Number,
        required:true
    },
    amount:{
        type: Number,
        required:true
    },
    coupon :String,
    transactionId:String,
    status:{
        type: String,
        // enum : ["ORDERED","SHIIPPED","DELIVERED","CANCELLED"],  // NEED TO CREATE LIKE AUTHROLS
        emu : Object.values(OrderRoles),  //Done
        default : "ORDERED"
    },

    //paymentMode 
},
{
    timestamps : true
}
);

export default mongoose.model("Order",orderSchema);