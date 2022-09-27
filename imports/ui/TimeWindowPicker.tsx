import React, { useEffect, useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

export default function TimeWindowPicker(
  { startDateTime, handleChangeStartDateTime, endDateTime, handleChangeEndDateTime }
) {
  const [startValue, setStartValue] = useState<Dayjs | null>(dayjs(startDateTime));
  const [endValue, setEndValue] = useState<Dayjs | null>(dayjs(endDateTime));

  useEffect(() => {
    setStartValue(startDateTime);
    setEndValue(endDateTime)
  }, [startDateTime, endDateTime])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" spacing={2} sx={{width:'100%'}}>
        <DateTimePicker
          label="Start Date & Time"
          inputFormat='DD/MM/YYYY hh:mm A'
          value={startValue}
          onChange={(inputStartDate) => {
            setStartValue(inputStartDate);
            handleChangeStartDateTime(inputStartDate);
          }}
          renderInput={(params) => <TextField {...params} fullWidth />}
          minDateTime={dayjs("2013-10-02T05:00:00")}
          maxDateTime={dayjs("2013-12-03T15:30:00")}
          hideTabs={false}
        />
        <DateTimePicker
          label="End Date & Time"
          inputFormat='DD/MM/YYYY hh:mm A'
          value={endValue}
          onChange={(inputEndDate) => {
            setEndValue(inputEndDate);
            handleChangeEndDateTime(inputEndDate)
          }}
          renderInput={(params) => <TextField {...params} fullWidth />}
          minDateTime={dayjs(startDateTime)}
          maxDateTime={dayjs("2013-12-03T15:30:00")}
          hideTabs={false}
        />
      </Stack>
    </LocalizationProvider>
  );
}