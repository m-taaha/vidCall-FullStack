import { createContext, useContext, useState } from "react";



export const MeetingContext = createContext();

export const MeetingContextProvider = ({children}) => {
    const [audio, setAudio] = useState(true);
    const [camera, setCamera] = useState(true);



    return (
        <MeetingContext.Provider value={{audio, setAudio, camera, setCamera}}>
            {children}
        </MeetingContext.Provider>
    )
}





export const useMeeting = () => {
    const context = useContext(MeetingContext);

    if(context === undefined) {
        throw new Error("useMeeting must be used with an MeetingProvideer")
    }
    return context;
}