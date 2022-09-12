import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { RoomTemp, RoomTempCollection } from '../db/temps';
import { Dayjs } from 'dayjs';


export const RoomTempModel = () => {
  const VALID_START_DATE = new Date("2013-10-02T05:00:00");
  const VALID_END_DATE = new Date("2013-12-03T15:30:00");

  const [startDateTime, setStartDateTime] =
    useState(new Date("2013-10-02T05:00:00"));
  const [endDateTime, setEndDateTime] =
    useState(new Date("2013-10-02T20:00:00"));
  /* const [sampleSize, setSampleSize] =
    useState() */

  const handleChangeStartDateTime = (inputStartDate: Dayjs | string | null): void => {
    let startDateTime: Date | null = null;
    if (typeof(inputStartDate) === "string") {
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
    if (typeof(inputEndDate) === "string") {
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

  // referenced from https://anonyfox.com/spells/meteor-react-collection-hooks/
  // https://blog.meteor.com/introducing-usetracker-react-hooks-for-meteor-cb00c16d6222
  const getRoomTemps = () => useTracker(() => {
    console.log("Fetching RoomTempCollection...");
    const handler: Meteor.SubscriptionHandle =
      Meteor.subscribe('temps', [startDateTime, endDateTime]);
    const roomTemps = RoomTempCollection.find({
      timestamp: {
        $gt: startDateTime,
        $lt: endDateTime
      }
    }).fetch()
    return {
      roomTemps,
      isLoading: !handler.ready()
    }
  }, [startDateTime, endDateTime])

  // useEffect(() => {
  //   const { roomTemps, isLoading } = getRoomTemps();
  //   if (!isLoading){
  //     setRoomTemps(roomTemps);
  //   }
  // })

  return {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    getRoomTemps
  }

}