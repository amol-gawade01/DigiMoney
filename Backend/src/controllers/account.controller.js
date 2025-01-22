import { mongoose } from 'mongoose';
import {Account, balance} from '../models/account.model.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"

const getBalance = asyncHandler( async (req,res) => {
    const userId = req.user._id;
    const account = await Account.findById(userId)
    return res.status(201)
    .json(
        new ApiResponse(200,account.balance,"Balance fetch successfully")
    )
})

const transferBalance = asyncHandler(async (req,res) => {
    const session = await mongoose.startSession()
    session.startTransaction()


    const {toUser,amount} = req.body;
    const fromAccount = await Account.findOne({userId:req.use._id}).session(session)

    if (!fromAccount || fromAccount.balance < amount) {
        await session.abortTransaction()
        throw new ApiError(401,"Insufficient Balance")
    }

    const toAccount  = Account.findOne({userId:toUser}).session(session)
    if (!toAccount) {
        await session.abortTransaction()
        throw new ApiError(401,"Invalid User")
    }

    // Performing Trasaction
    await Account.updateOne({userId:req.user_id},{$inc:{balance:-amount}}).session(session)
    await Account.updateOne({userId:toUser},{$inc:{balance:amount}}).session(session)
    session.commitTransaction();

    return res.status(200)
    .json(
        new ApiResponse(200,{},`Transaction of ${amount} successfully done `)
    )
})

export {
    getBalance,
    transferBalance
}