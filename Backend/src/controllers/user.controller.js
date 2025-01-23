import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Account } from "../models/account.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateRefreshAndAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, lastName, email, password } = req.body;
  if (
    [userName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(401, "Some fields are empty");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user with name or email alrady exist");
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    lastName,
    email,
    password,
  });

  if (!user) {
    throw new ApiError(500, "Error while creating user");
  }

  await Account.create({
    userId: user._id,
    balance: 1 + Math.floor(Math.random() * 10000),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if ([userName, password].some((f) => f?.trim() === "")) {
    throw new ApiError(401, "Fields should not be empty");
  }

  const user = await User.findOne({ userName });
  if (!user) {
    throw new ApiError(401, "user does not exist");
  }

  const checkPassword = await user.isPassswordCorrect(password);

  if (!checkPassword) {
    throw new ApiError(401, "Password is invalid");
  }

  const { refreshToken, accessToken } = await generateRefreshAndAccessToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    seure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { loggedInUser, accessToken }, refreshToken));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const updateUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  if (!(userName || lastName || password)) {
    throw new ApiError(401, "Fields should not be empty");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        userName,
        lastName,
        password,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "user updated successfully"));
});

const filterUser = asyncHandler(async (req, res) => {
  const {filter,page ,limit } = req.query;
  const pageLimit = parseInt(limit) || 10;
  const pageNumber = parseInt(page) || 1;
  if (!filter) {
    throw new ApiError(401, "require a name to search");
  }

  const users = await User.aggregate([
    {
      $match: {
        $or: [
          { userName: { $regex: filter } },
          { fullName: { $regex: filter } },
        ],
      },
    },
    {
      $skip:  (pageNumber - 1 )*pageLimit
    },{
      $limit:pageLimit
    }
  ]);
 
  if (users.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No users found matching the filter."));
  }


  return res
    .status(201)
    .json(new ApiResponse(200, users, "Users filtered successfully"));
});

export { registerUser, loginUser, logoutUser, updateUser, filterUser };
