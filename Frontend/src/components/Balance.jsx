import React, { useEffect, useState } from 'react'
import axios from "axios"
import {useSelector} from "react-redux"

function Balance() {

  const [balance,setBalance] = useState(0)
  const authStatus = useSelector((store) => store.auth.status)

  const fetchBalance = async () => {
    const balanceData =  await axios.get("http://localhost:8000/api/v1/account/balance",{ withCredentials: true})
    console.log(balanceData.data)
    if (balanceData) {
      setBalance(balanceData.data.data)
    }
  }

  useEffect(() => {
  
    if (authStatus) {
      fetchBalance()   
    }
    
  },[])
  return (
    <div className='lg:mt-5 mt-3 lg:ml-32 overflow-hidden'>
        <h3 className='text-black text-md font-semibold dark:text-white'>Your Balance is {balance}</h3>
    </div>
  )
}

export default Balance