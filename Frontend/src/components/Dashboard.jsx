import React from 'react';
import { Balance, Button, InputButton } from './index.js';
import { Users } from './index.js';
import { useSelector } from 'react-redux';

function Dashboard() {
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
        />
        <Button
        className='w-[200px] rounded-md ml-6 pb-2 text-white dark:text-black dark:bg-white text-center'>
          Search
        </Button>
      </div>

      {/* Users Section */}
      <div className="justify-center px-4 lg:px-16">
        {/* Horizontal padding added */}
        <Users />
      </div>
    </div>
  );
}

export default Dashboard;
