import React, { useState } from 'react';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export const BasicDateTimePicker = (
  { startDateTime, handleChangeStartDateTime, endDateTime, handleChangeEndDateTime }
) => {
  const [startValue, setStartValue] = useState<Dayjs | null>(dayjs(startDateTime));
  const [endValue, setEndValue] = useState<Dayjs | null>(dayjs(endDateTime));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Start Date & Time"
        inputFormat='DD/MM/YYYY hh:mm A'
        value={startValue}
        onChange={(inputStartDate) => {
          setStartValue(inputStartDate);
          handleChangeStartDateTime(inputStartDate);
        }}
        // onAccept={(value) => console.log("test")}
        renderInput={(params) => <TextField {...params} />}
        minDateTime={dayjs("2013-10-02T05:00:00")}
        maxDateTime={dayjs("2013-12-03T15:30:00")}
      />
      <DateTimePicker
        label="End Date & Time"
        inputFormat='DD/MM/YYYY hh:mm A'
        value={endValue}
        onChange={(inputEndDate) => {
          setEndValue(inputEndDate);
          handleChangeEndDateTime(inputEndDate)
        }}
        renderInput={(params) => <TextField {...params} />}
        minDateTime={dayjs(startDateTime)}
        maxDateTime={dayjs("2013-12-03T15:30:00")}
      />
    </LocalizationProvider>
  );
}