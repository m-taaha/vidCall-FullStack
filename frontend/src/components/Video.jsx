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
    <div className="relative bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl h-full w-full">
      <video
        playsInline
        autoPlay
        ref={ref}
        className="w-full h-full object-cover -scale-x-100"
      />
    </div>
  );
}

export default Video