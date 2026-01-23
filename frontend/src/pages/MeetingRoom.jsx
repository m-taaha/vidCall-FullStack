import React from 'react'
import { useMeeting } from '../context/MeetingContext'

function MeetingRoom() {
  const {audio, setAudio, camera, setCamera} = useMeeting();


  return (
    <div className=''>
      
    </div>

  )
}

export default MeetingRoom