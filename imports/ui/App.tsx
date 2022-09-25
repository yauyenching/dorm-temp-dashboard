import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams, createSearchParams, useLocation } from 'react-router-dom';
import TimeWindowPicker from './TimeWindowPicker';
import { RoomTempModel, SegregatedRoomTemps } from '../api/RoomTempModel';
import SampleSlider from './SampleSlider';
import { startParams, loadParamsOnStartup, setAppParams } from '../utils/linkability';
import { Grid, createTheme, ThemeProvider } from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';
import { RoomTemp, RoomTempCollection } from '../db/temps';

const TimeSeries = React.lazy(() => import('./TimeSeries'));
const FloorPlan = React.lazy(() => import('./FloorPlan'));

function MainPage() {
  const location = useLocation();
  const urlParams = createSearchParams(location.search);
  const loadParams: Partial<startParams> = loadParamsOnStartup(urlParams);

  const {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    sampleScale, handleChangeSampleSize,
    visibleRooms, handleToggleVisibleRooms,
    changedParams, getRoomTemps,
    segregateTempData
  } = RoomTempModel(loadParams);

  const linkabilityReference: Readonly<startParams> = {
    start: startDateTime,
    end: endDateTime,
    sample: sampleScale,
    visible: visibleRooms
  }

  const [dashboardParams, setDashboardParams] = useSearchParams(urlParams);
  const newAppParams = createSearchParams(dashboardParams);

  useEffect(() => {
    setAppParams(linkabilityReference, newAppParams, changedParams);
    setDashboardParams(newAppParams);
  }, [changedParams])

  let roomTemps: SegregatedRoomTemps = {
    "0": [],
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": []
  };

  const isLoading = getRoomTemps();
  if (!isLoading) {
    let roomTempsData: RoomTemp[] = RoomTempCollection.find({
      timestamp: {
        $gt: startDateTime,
        $lt: endDateTime
      }
    }).fetch();
    const roomTempsSegregated = segregateTempData(roomTempsData);
    roomTemps = roomTempsSegregated;
  }

  const theme = createTheme({
    typography: {
      fontFamily: "'Barlow', sans-serif",
    },
    palette: {
      primary: {
        main: '#7596FA',
      },
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <div id="header">
        <h1>Dorm Temperature Monitoring Dashboard</h1>
      </div>
      <div className='container'>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item md={7} xs={12}>
            <TimeWindowPicker
              startDateTime={startDateTime}
              handleChangeStartDateTime={handleChangeStartDateTime}
              endDateTime={endDateTime}
              handleChangeEndDateTime={handleChangeEndDateTime}
            />
          </Grid>
          <Grid item md={5} xs={12}>
            <SampleSlider
              sampleScale={sampleScale}
              handleChangeSampleSize={handleChangeSampleSize}
            />
          </Grid>
          <Grid item lg={8} md={7} xs={12}>
            <Suspense fallback={<div>Loading time series...</div>}>
              <TimeSeries
                handleChangeStartDateTime={handleChangeStartDateTime}
                handleChangeEndDateTime={handleChangeEndDateTime}
                roomTemps={roomTemps}
                sampleScale={sampleScale}
                visibleRooms={visibleRooms}
              />
            </Suspense>
          </Grid>
          <Grid item lg={4} md={5} xs={12}>
            <Suspense fallback={<div>Loading floor plan...</div>}>
              <FloorPlan
                visibleRooms={visibleRooms}
                handleToggleVisibleRooms={handleToggleVisibleRooms}
                roomTemps={roomTemps}
              />
            </Suspense>
          </Grid>
          <Grid item mt={4}>
            Made with 🧡 by Yau Yen Ching 
            <a target="_blank" href="https://github.com/yauyenching">
              <GitHub fontSize='small' sx={{color:'#3D405B'}}/>
            </a> 
            <a target="_blank" href="https://www.linkedin.com/in/yau-yen-ching">
              <LinkedIn fontSize='small' sx={{color:'#3D405B'}}/>
            </a>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
