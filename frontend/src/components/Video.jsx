import React, { useEffect, useRef } from 'react'

function Video({peer}) {
    const ref = useRef();

    useEffect(() => {
        
        peer.on("stream", (stream) => {
            if(ref.current) {
                ref.current.srcObject = stream;
            }
        })
    })


  return (
    <div>
        <video 
        playsInline
        autoPlay
        ref={ref}
        className='w-full h-full object-cover'
        />
    </div>
  )
}

export default Video