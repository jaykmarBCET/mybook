import React from 'react'
import {Link} from 'react-router-dom'

function NotFound() {
  return (
    <div className='flex w-full flex-col  items-center justify-center h-screen'>
      <h1 className='text-xl font-semibold bg-gray-100 px-4 py-2 rounded-xl shadow-xl text-center border border-blue-400'> <span className='text-4xl font-bold'>404</span> Page not Found</h1>
      <Link className='px-2 py-2 border-b-2 text-blue-400 border-blue-400' to={"/"}>Home Page</Link>
    </div>
  )
}

export default NotFound