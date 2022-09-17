import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import TimeSeries from './TimeSeries';
import Hello from './Hello';
import TimeWindowPicker from './TimeWindowPicker';
import { RoomTempModel, SegregatedRoomTemps } from '../api/RoomTempModel';
import SampleSlider from './SampleSlider';
import FloorPlan from './FloorPlan';

function MainPage() {
  const {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime, 
    sampleScale, setSampleScale,
    visibleRooms, handleToggleVisibleRooms,
    getRoomTemps
  } = RoomTempModel();

  
  let roomTemps: SegregatedRoomTemps = {
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
        sampleScale={sampleScale}
        setSampleScale={setSampleScale}
        />
      <TimeSeries
        handleChangeStartDateTime={handleChangeStartDateTime}
        handleChangeEndDateTime={handleChangeEndDateTime}
        roomTemps={roomTemps}
        sampleScale={sampleScale}
        visibleRooms={visibleRooms}
      />
      <FloorPlan
        visibleRooms={visibleRooms}
        handleToggleVisibleRooms={handleToggleVisibleRooms}
        roomTemps={roomTemps}
      />
    </div>
  );
}

export default function App() {
  {/* <Router>
      <Route path="/" element={<MainPage/>} />
    </Router> */}
  return (
    <MainPage/>
  );
}
