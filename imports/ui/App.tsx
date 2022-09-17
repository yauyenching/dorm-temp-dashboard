import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams, createSearchParams, useLocation } from 'react-router-dom';
import TimeSeries from './TimeSeries';
import Hello from './Hello';
import TimeWindowPicker from './TimeWindowPicker';
import { RoomTempModel, SegregatedRoomTemps } from '../api/RoomTempModel';
import SampleSlider from './SampleSlider';
import FloorPlan from './FloorPlan';

function MainPage() {
  const location = useLocation();
  const urlParams = createSearchParams(location.search);
  console.log(urlParams.get('start'))

  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = createSearchParams(searchParams);
  
  const {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    sampleScale, setSampleScale,
    visibleRooms, handleToggleVisibleRooms,
    getRoomTemps
  } = RoomTempModel();
  // const params = new URLSearchParams("?mode=night&page=2");
  // useEffect(() => setSearchParams("start"), []);
  console.log(startDateTime.toJSON());
  newSearchParams.set("start", startDateTime.toJSON());
  useEffect(() => setSearchParams(newSearchParams), []);
  // console.log(new Date(searchParams.get("start") ?? ""));
  // newSearchParams.set("start", endDateTime.toISOString());
  // const newSearchParams = createSearchParams(searchParams)

  // const [startDateTimeParam, setStartDateTimeParam] = useQueryParam<Date>("start");
  // useEffect(() => setStartDateTimeParam(startDateTime), []);

  // console.log(startDateTime.toISOString())

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
  return (
    // <MainPage/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
