import React from "react";
import { Button } from "./index.js";

function Users({ users}) {
  console.log(
    "This are users",users
  )
  return (
    <div className=" w-full h-full mt-6 lg:mt-12 overflow-x-hidden  ">
       { users?.length > 0  && users.map((u) => (
         
         
         <div key={u._id} className="flex flex-row justify-between border-b  border-gray-300 pb-2 mb-2">
          <div className="dark:text-white font-semibold justify-self-center mt-6">
          <h3>{u.userName}</h3>
        </div>
        <div>
          <Button className="w-full rounded-2xl text-white dark:bg-white dark:text-black font-semibold border-b ">
            Send Money
          </Button>
        </div>
        </div>
       )) }
      
    </div>
  );
}

export default Users;
