import React from 'react'
import logo from '../../assets/logo.jpg'
import { Button } from "../ui/button"


function Header() {
  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
        <img src={logo} alt='logo' className='size-15 rounded-[50%] '/>
        <div>
            <Button>Sign In</Button>
        </div>
    </div>
  )
}

export default Header