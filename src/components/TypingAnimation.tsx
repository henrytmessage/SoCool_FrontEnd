import React from 'react'

const TypingAnimation = () => {
  return (
    <div className='flex items-center space-x-2'>
  	  <div className='h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
	    <div className='h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
	    <div className='h-4 w-4 bg-black rounded-full animate-bounce'></div>
    </div>
  )
}

export default TypingAnimation