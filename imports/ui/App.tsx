import React from 'react';
import Graph from './Graph';
import Hello from './Hello';
import TimeWindowPicker from './TimeWindowPicker';
import RoomTempModel from '../api/RoomTempModel';
import { RoomId, RoomIdTempData } from '../db/temps';
import SampleSlider from './SampleSlider';

export default function App() {
  const {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime, 
    sampleSize, setSampleSize,
    getRoomTemps
  } = RoomTempModel();

  
  let roomTemps: Record<RoomId, RoomIdTempData[]> = {
    "0": [],
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": []
  };

  const { isLoading, roomTempsSegregated } = getRoomTemps();
  if (!isLoading) {
    roomTemps = roomTempsSegregated;
  }

  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      <Hello />
      <TimeWindowPicker
        startDateTime={startDateTime}
        handleChangeStartDateTime={handleChangeStartDateTime}
        endDateTime={endDateTime}
        handleChangeEndDateTime={handleChangeEndDateTime}
      />
      <SampleSlider
        sampleSize={sampleSize}
        setSampleSize={setSampleSize}
        roomTemps={roomTemps}
      />
      <Graph
        handleChangeStartDateTime={handleChangeStartDateTime}
        handleChangeEndDateTime={handleChangeEndDateTime}
        roomTemps={roomTemps}
      />
    </div>
  );
}
