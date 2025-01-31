import React, { useId } from 'react'

function InputButton(
   { label,
    type = 'text',
    className ='',
    ...props
},ref){
    const id = useId();
    
    return <div className='w-full'>
        {label && <label className='inline-block mb-1 dark:text-white font-semibold font-sans' htmlFor={id}>{label}</label>
        }
        <input 
        type={type}
        className={`${className} dark:bg-black  dark:focus:bg-black dark:text-white px-3 py-2  bg-inherit text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full placeholder-gray-500`}
        {...props}
        ref={ref}
        id={id}
        />
    </div>
}

export default React.forwardRef(InputButton)

