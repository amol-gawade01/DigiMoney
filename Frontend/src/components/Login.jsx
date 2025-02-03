import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, InputButton, Logo } from "./index.js";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import axios from "axios";
import {login as authLogin} from "../store/authSlice.js"


function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();


  const onLogin = async (data) => {
    setError("");
    try {
      const sendDataToBackend = await axios.post('http://localhost:8000/api/v1/users/login',{userName:data.name,password:data.password},{
        withCredentials: true 
      });
      
      if (sendDataToBackend) {
      const userData =   await axios.get(`http://localhost:8000/api/v1/users/getuser`,{
        withCredentials: true 
      })
      console.log("This is the data",userData.data)
      if(userData){
       dispatch(authLogin(userData.data.data))
      }
        navigate("/")
      }
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || "Something went wrong");
    }
  };
   
  return (
    <div className="flex items-center justify-center lg:w-full w-[90%] m-auto lg:m-0  lg:mt-20">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center dark:text-black text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
      
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(onLogin)} className="mt-8">
          <div className="space-y-5">
          <InputButton
              label="Username: "
              placeholder="Enter your user name"
              {...register("name", {
                required: true,
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
              <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>

            <Button
              type="submit"
              className="w-full text-white rounded-md"
              bgColor="bg-black"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
