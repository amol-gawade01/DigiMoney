import React, { useEffect, useState } from 'react';
import { Balance, Button, InputButton } from './index.js';
import { Users } from './index.js';
import axios from "axios"
import { useSelector } from 'react-redux';

function Dashboard() {
  const [user,setUser] = useState("")
  const [searchUsers,setSearchusers] = useState(null)
  const [error,setError] = useState(null)
  const userData = useSelector((store) => store.auth.user)

 const  searchUser = async() => {
  setError(null)
 
  
 try {
  if (user === "") {
    setError("Give a user name to search")
    return;
  }
   
  if (user === userData.userName) {
    setError("You cant pay to yourself");
    return;
  }

  const filteredUsers = await axios.get(`http://localhost:8000/api/v1/users/find?filter=${user}&page=1&limit=10`, { withCredentials: true })


   console.log(filteredUsers)
   if (filteredUsers.data.data.length > 0) { 
    setSearchusers(filteredUsers.data.data);
  }
  
 } catch (error) {
  console.log("This is error",error.response.data.data.message)
  setError(error.response.data.message)
 }
  
  }
 
  useEffect(() =>{
     setError("")
  },[searchUsers])


  return (
    <div className="flex flex-col lg:m-2 w-screen m-auto min-h-screen overflow-x-hidden">
      {/* Balance Section */}
      <div>
        <Balance />
      </div>
      
      <div className="flex flex-row justify-center mt-4 w-1/2  ml-6 lg:ml-10">
        <InputButton
          className="w-full rounded-md text-center border-2 border-gray-300 "
          placeholder="Search user"
          onChange={(e) => {
            setUser(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchUser()
            }
          }}
        />
        <Button
        className='w-[200px] rounded-md ml-6 pb-2 text-white dark:text-black dark:bg-white text-center' onClick={() => {
          searchUser()
        }} >
         
          Search
        </Button>
      </div>

      {/* Users Section */}
      <div className="justify-center px-4 lg:px-16">
        {/* Horizontal padding added */}
      { error ? <h4> {error}</h4>: <Users users={searchUsers} />}
      </div>
    </div>
  );
}

export default Dashboard;
