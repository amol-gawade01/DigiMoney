import { mongoose } from 'mongoose';
import {Account} from '../models/account.model.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const getBalance = asyncHandler( async (req,res) => {
    const userId = req.user?._id;
    console.log(userId)
    const account = await Account.findOne({userId})
    console.log(account)
    return res.status(200)
    .json(
        new ApiResponse(200,account.balance,"Balance fetch successfully")
    )
})

const transferBalance = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
  
      const { toUser, amount } = req.body;
      const toUserObjectId = new mongoose.Types.ObjectId(toUser);
      console.log(toUserObjectId)
      // Fetch sender's account
      const fromAccount = await Account.findOne({ userId: req.user?._id }).session(session);
      if (!fromAccount || fromAccount.balance < amount) {
        throw new ApiError(401, "Insufficient Balance");
      }
  
      // Fetch receiver's account
      const toAccount = await Account.findOne({ userId: toUserObjectId }).session(session);
      if (!toAccount) {
        throw new ApiError(401, "Invalid User");
      }
  
      // Perform Transaction
      await Account.updateOne(
        { userId: req.user._id },
        { $inc: { balance: -amount } }
      ).session(session);
  
      await Account.updateOne(
        { userId: toUser },
        { $inc: { balance: amount } }
      ).session(session);
  
      // Commit the transaction
      await session.commitTransaction();
      return res.status(200).json(
        new ApiResponse(200, {}, `Transaction of ${amount} successfully completed`)
      );
    } catch (error) {
      // Abort the transaction only if it hasn't been aborted already
      if (session.transaction.state === "TRANSACTION_IN_PROGRESS") {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      // Always end the session
      session.endSession();
    }
  });
  

export {
    getBalance,
    transferBalance
}