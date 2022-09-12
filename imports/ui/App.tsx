import React from 'react';
import { Graph } from './Graph';
import { Hello } from './Hello';
import { BasicDateTimePicker } from './BasicDateTimePicker';
import { RoomTempModel } from '../api/RoomTempModel';

export const App = () => {
  const {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime, getRoomTemps
  } = RoomTempModel();

  return (
    <div>
      <h1>Welcome to Meteor!</h1>
      <Hello />
      <BasicDateTimePicker
        startDateTime={startDateTime}
        handleChangeStartDateTime={handleChangeStartDateTime}
        endDateTime={endDateTime}
        handleChangeEndDateTime={handleChangeEndDateTime}
        />
      <Graph 
        handleChangeStartDateTime={handleChangeStartDateTime}
        handleChangeEndDateTime={handleChangeEndDateTime}
        getRoomTemps={getRoomTemps}
      />
    </div>
  );
}
