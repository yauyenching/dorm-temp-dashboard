import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { RoomId, RoomIdTempData, RoomTemp, RoomTempCollection } from '../db/temps';
import { Dayjs } from 'dayjs';

export default function RoomTempModel() {
  const [startDateTime, setStartDateTime] =
    useState(new Date("2013-10-02T05:00:00"));
  const [endDateTime, setEndDateTime] =
    useState(new Date("2013-10-03T05:00:00"));
  const [sampleScale, setSampleScale] = useState(8);
  const visibleRooms = {
    "0": true,
    "1": true,
    "2": true,
    "3": true,
    "4": true,
    "5": true,
    "6": true
  } as Record<RoomId, boolean>

  const VALID_START_DATE = new Date("2013-10-02T05:00:00");
  const VALID_END_DATE = new Date("2013-12-03T15:30:00");

  // const MIN_SAMPLE_SIZE = 0;
  // const MAX_SAMPLE_SIZE = 12;

  type avgTempArr = [number, number, number, number, number, number];

  function segregateTempData(roomTemps: RoomTemp[]): Record<RoomId, RoomIdTempData[]> {
    return roomTemps.reduce((acc, roomTemp) => {
      const key = roomTemp.roomId;
      // console.log(key);
      // console.log(roomTemp[property]);
      // acc[Number(key)] ??= [];
      acc[Number(key)].push({
        x: roomTemp.timestamp,
        y: roomTemp.temperature
      });
      return acc;
    },
      {
        "0": [],
        "1": [],
        "2": [],
        "3": [],
        "4": [],
        "5": [],
        "6": []
      });
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

  function handleChangeStartDateTime(input: Dayjs | string | null | undefined): void {
    let inputStartDateTime: Date | null = null;
    if (typeof (input) === "string") {
      inputStartDateTime = new Date(input)
    } else if (input !== null && input !== undefined) {
      inputStartDateTime = input.toDate()
    }
    if (
      inputStartDateTime !== null &&
      inputStartDateTime.toString() !== 'Invalid Date' &&
      inputStartDateTime >= VALID_START_DATE &&
      inputStartDateTime <= VALID_END_DATE
    ) {
      setStartDateTime(inputStartDateTime)
      // console.log(startDateTime)
    }
    // console.log(`startDateTime: ${startDateTime}`);
  }

  function handleChangeEndDateTime(input: Dayjs | string | null | undefined): void {
    let inputEndStartTime: Date | null = null;
    if (typeof input === "string") {
      inputEndStartTime = new Date(input)
    } else if (input !== null && input !== undefined) {
      inputEndStartTime = input.toDate()
    }
    if (
      inputEndStartTime !== null &&
      inputEndStartTime.toString() !== 'Invalid Date' &&
      inputEndStartTime <= VALID_END_DATE &&
      inputEndStartTime >= startDateTime
    ) {
      setEndDateTime(inputEndStartTime)
      // console.log(endDateTime)
    }
    // console.log(`endDateTime: ${endDateTime}`);
  }

  function handleToggleVisibleRooms(roomId: RoomId): void {
    const key = String(roomId);
    const oldState = visibleRooms[key]
    visibleRooms[key] = !oldState
  }

  return {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    sampleScale, setSampleScale,
    visibleRooms, handleToggleVisibleRooms,
    getRoomTemps
  }
}