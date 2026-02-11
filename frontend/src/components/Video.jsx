import React, { useEffect, useRef } from 'react'

function Video({peer}) {
    const ref = useRef();

    useEffect(() => {

        const handleStream = (stream) => {
            if(ref.current) {
                ref.current.srcObject = stream;
            }
        };
        
        peer.on("stream", handleStream);

        return () => {
            peer.removeListener("stream", handleStream);
        };
    }, [peer]);

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