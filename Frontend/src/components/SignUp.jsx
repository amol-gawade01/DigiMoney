import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputButton, Button } from "./index.js";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "./index.js";
import axios from "axios"


function Signup() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSignup = async (data) => { 
    setError("");
    try {
      const sendDataToBackend = await axios.post(
          "http://localhost:8000/api/v1/users/register",
          {
              userName: data.name,
              lastName: data.lastname,
              email: data.email,
              password: data.password
          },
          {
              withCredentials: true  // Include cookies & authentication headers
          }
      );
      if (sendDataToBackend) {
        navigate("/login")
      }
  } catch (error) {
      setError(error.message);
  }
  
  };
  return (
    <div className="flex items-center justify-center lg:w-full w-[90%] m-auto lg:m-0  lg:mt-10 selct-none">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSignup)}>
          <div className="space-y-5">
            <InputButton
              label="Username: "
              placeholder="Enter your user name"
              {...register("name", {
                required: true,
              })}
            />

            <InputButton
              label="Lastname: "
              placeholder="Enter your last name"
              {...register("lastname", {
                required: true,
              })}
            />
            <InputButton
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            <InputButton
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button
              type="submit"
              className="w-full text-white rounded-md"
              bgColor="bg-black"
            >
              Create Account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
