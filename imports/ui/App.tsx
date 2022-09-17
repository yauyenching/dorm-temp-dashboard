import React, { useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams, createSearchParams, useLocation } from 'react-router-dom';
import TimeSeries from './TimeSeries';
import Hello from './Hello';
import TimeWindowPicker from './TimeWindowPicker';
import { RoomTempModel, SegregatedRoomTemps } from '../api/RoomTempModel';
import SampleSlider from './SampleSlider';
import FloorPlan from './FloorPlan';
import { startParams, loadParamsOnStartup, setAppParams } from '../utils/linkability';
import { useTracker } from 'meteor/react-meteor-data';

function MainPage() {
  const location = useLocation();
  const urlParams = createSearchParams(location.search);
  const loadParams: Partial<startParams> = loadParamsOnStartup(urlParams);

  const {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    sampleScale, handleChangeSampleSize,
    visibleRooms, handleToggleVisibleRooms,
    changedParams, setChangedParams,
    getRoomTemps
  } = RoomTempModel(loadParams);

  const linkabilityReference: Readonly<startParams> = {
    start: startDateTime,
    end: endDateTime,
    sample: sampleScale,
    visible: visibleRooms
  }

  // console.log(startDateTime.toJSON());
  const [dashboardParams, setDashboardParams] = useSearchParams(urlParams);
  const newAppParams = createSearchParams(dashboardParams);

  // const updatedParams = {...changedParams};
  console.log(changedParams);

  useEffect(() => {
    setAppParams(linkabilityReference, newAppParams, changedParams);
    setDashboardParams(newAppParams);
  }, [changedParams])

  // setChangedParams(updatedParams);

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
        handleChangeSampleSize={handleChangeSampleSize}
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
