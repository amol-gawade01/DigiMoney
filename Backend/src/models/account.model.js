import mongoose,{Schema} from "mongoose";

const accountSchema = new Schema({
    
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            require:true
        },
        balance:{
            type:Number,
            default:0,
            require:true
        }
    
})


export const Account = mongoose.model("Account",accountSchema);
