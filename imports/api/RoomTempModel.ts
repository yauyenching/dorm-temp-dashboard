import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { RoomId, RoomIdTempData, RoomTemp, RoomTempCollection } from '../db/temps';
import { Dayjs } from 'dayjs';


export default function RoomTempModel() {
  const VALID_START_DATE = new Date("2013-10-02T05:00:00");
  const VALID_END_DATE = new Date("2013-12-03T15:30:00");

  // const MIN_SAMPLE_SIZE = 0;
  // const MAX_SAMPLE_SIZE = 12;

  const [startDateTime, setStartDateTime] =
    useState(new Date("2013-10-02T05:00:00"));
  const [endDateTime, setEndDateTime] =
    useState(new Date("2013-10-02T20:00:00"));
  const [sampleSize, setSampleSize] = useState(8);

  const handleChangeStartDateTime = (inputStartDate: Dayjs | string | null): void => {
    let startDateTime: Date | null = null;
    if (typeof (inputStartDate) === "string") {
      startDateTime = new Date(inputStartDate)
    } else if (inputStartDate !== null && inputStartDate !== undefined) {
      startDateTime = inputStartDate.toDate()
    }
    if (
      startDateTime !== null &&
      startDateTime.toString() !== 'Invalid Date' &&
      startDateTime >= VALID_START_DATE &&
      startDateTime <= VALID_END_DATE
    ) {
      setStartDateTime(startDateTime)
      // console.log(startDateTime)
    }
  }

  const handleChangeEndDateTime = (inputEndDate: Dayjs | string | null | undefined): void => {
    let endDateTime: Date | null = null;
    if (typeof (inputEndDate) === "string") {
      endDateTime = new Date(inputEndDate)
    } else if (inputEndDate !== null && inputEndDate !== undefined) {
      endDateTime = inputEndDate.toDate()
    }
    if (
      endDateTime !== null &&
      endDateTime.toString() !== 'Invalid Date' &&
      endDateTime <= VALID_END_DATE &&
      endDateTime > startDateTime
    ) {
      setEndDateTime(endDateTime)
      // console.log(endDateTime)
    }
  }

  function segregateTempData(roomTemps: RoomTemp[]): Record<RoomId, RoomIdTempData[]> {
    return roomTemps.reduce((acc, roomTemp) => {
      const key = roomTemp.roomId;
      // console.log(key);
      // console.log(roomTemp[property]);
      acc[Number(key)] ??= [];
      acc[Number(key)].push({
        x: roomTemp.timestamp,
        y: roomTemp.temperature
      });
      return acc;
    }, {} as Record<RoomId, RoomIdTempData[]>);
  }

  // referenced from https://anonyfox.com/spells/meteor-react-collection-hooks/
  // https://blog.meteor.com/introducing-usetracker-react-hooks-for-meteor-cb00c16d6222
  const getRoomTemps = () => useTracker(() => {
    console.log("Fetching RoomTempCollection...");
    const handler: Meteor.SubscriptionHandle =
      Meteor.subscribe('temps', [startDateTime, endDateTime]);
    const roomTempsData = RoomTempCollection.find({
      timestamp: {
        $gt: startDateTime,
        $lt: endDateTime
      }
    }).fetch()
    const roomTempsSegregated = segregateTempData(roomTempsData)
    return {
      roomTempsSegregated,
      isLoading: !handler.ready()
    }
  }, [startDateTime, endDateTime])



  return {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    sampleSize, setSampleSize,
    getRoomTemps
  }
}