import mongoose from "mongoose";
import { User } from "../models/user.model.js";
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
  const { userName,lastName, email, password } = req.body;
  if ([userName,lastName, email, password].some((field) => field?.trim() === "")) {
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

const filterUser  = asyncHandler(async (req,res) => {
  const filter = req.query.filter;
  if (!filter) {
    throw new ApiError(401,"require a name to search")
  }

  const users = await User.find({
    $or:[
      {
        username:{$regex:`^${filter}`}
      },
      {
        lastName:{$regex:`^${filter}`}
      }
    ]
  })

  if (!users) {
    return res.status(201).json(
      new ApiResponse(200,{},"User not found ")
    )
  }

  return res.status(201)
  .json(new ApiResponse(
    200,
    users,
    "Users filtered successfully"
  ))

  

})

export { registerUser, loginUser, logoutUser,updateUser,filterUser };
