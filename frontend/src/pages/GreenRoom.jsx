import React from 'react'
import { useParams } from 'react-router-dom'



function GreenRoom() {
  // destructure the 'id' property from useParams
  const {id} = useParams();

  return (
    <div className='min-h-screen bg-slate-950 text-white p-8'>
      <h1 className='text-3xl font-bold mb-4'>Green Room</h1>
        <p>
          Meeting ID: <span className='text-blue-400 font-mono'>{id}</span>
        </p>


        {/* TODO: will build the preview and controls here */}
    </div>
  )
}

export default GreenRoom