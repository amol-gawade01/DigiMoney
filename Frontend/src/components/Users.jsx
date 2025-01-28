import React from "react";
import { Button } from "./index.js";

function Users() {
  return (
    <div className=" w-full h-full mt-6 lg:mt-12 overflow-x-hidden  ">
      <div className="flex flex-row justify-between border-b  border-gray-300 pb-2 mb-2">
        <div className="dark:text-white font-semibold justify-self-center mt-6">
          <h3>User 1</h3>
        </div>
        <div>
          <Button className="w-full rounded-2xl text-white dark:bg-white dark:text-black font-semibold border-b ">
            Send Money
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Users;
