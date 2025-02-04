import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import InputButton from './InputButton';
import Button from './Button';
import axios from "axios"

function Send() {
 
  const { id,name } = useParams();
  const [amount,setAmount] = useState("")
  const transfer = async() => {
  const amountTransfer =  await axios.post("http://localhost:8000/api/v1/account/transfer",{
    toUser:id,
    amount:amount
   },{
    withCredentials:true
   })
  alert(amountTransfer.data.message)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
        <h3 className="text-lg font-semibold text-gray-800 text-center">Send Money</h3>
        <div className="flex flex-col items-center mt-4">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <InputButton
            label="Amount"
            placeholder="$10000"
            onChange={(e) => {
              setAmount(e.target.value)
            }}
            className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <Button onClick={() => transfer()} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Send;
