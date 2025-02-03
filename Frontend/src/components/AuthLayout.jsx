import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { login } from '../store/authSlice'
import Cookies from "js-cookie"

export default function Protected({children, authentication = true}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const dispatch = useDispatch()
    
    const authStatus = useSelector(state => state.auth.status)
    const verifyCookie = async() => {
      const userData =  await axios.get("http://localhost:8000/api/v1/users/getuser",{withCredentials:true})
      
        if (userData) {
         dispatch(login(userData.data.data))
        }
      
    }

    useEffect(() => {
     
     
          if (authentication && authStatus !== authentication) {
            navigate("/login");
          } else if (!authentication && authStatus !== authentication) {
            navigate("/");
          }
          setLoader(false);
        
      
    }, [authStatus, authentication, navigate]);
    
  
  return loader ? <h1>Loading...</h1> : <>{children}</>
}
