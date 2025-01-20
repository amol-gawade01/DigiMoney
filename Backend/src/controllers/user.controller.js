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
  const { username, email, password } = req.body;
  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(401, "Some fields are empty");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user with name or email alrady exist");
  }

  const user = await User.create({
    username: username.toLowerCase(),
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
  const { username, password } = req.body;

  if ([username, password].some((f) => f?.trim() === "")) {
    throw new ApiError(401, "Fields should not be empty");
  }

  const user = await User.findOne({ username });
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
  const { username, password } = req.body;

  if (!(username || password)) {
    throw new ApiError(401, "Fields should not be empty");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        username,
        password,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(201)
    .json(new ApiResponse(200, {}, "user updated successfully"));
});

export { registerUser, loginUser, logoutUser,updateUser };
