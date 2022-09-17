import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams, createSearchParams, useLocation } from 'react-router-dom';
import TimeSeries from './TimeSeries';
import Hello from './Hello';
import TimeWindowPicker from './TimeWindowPicker';
import { RoomTempModel, SegregatedRoomTemps } from '../api/RoomTempModel';
import SampleSlider from './SampleSlider';
import FloorPlan from './FloorPlan';
import { startParams, loadParamsOnStartup, setAppParams } from '../utils/linkability';

function MainPage() {
  const location = useLocation();
  const urlParams = createSearchParams(location.search);
  const loadParams: Partial<startParams> = loadParamsOnStartup(urlParams);

  const {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    sampleScale, handleChangeSampleSize,
    visibleRooms, handleToggleVisibleRooms,
    changedParam, setChangedParam,
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

  // newAppParams.set("start", '2013-10-01T21:00:00.000Z');
  // newAppParams.set("end", '2013-11-03T21:00:00.000Z');
  // newAppParams.set("sample", '8');
  // // newAppParams.set("visible", '0110111');
  useEffect(() => {
    setAppParams(linkabilityReference, newAppParams, changedParam, setChangedParam);
    setDashboardParams(newAppParams);
  }, [changedParam, startDateTime, endDateTime, sampleScale, visibleRooms])

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
