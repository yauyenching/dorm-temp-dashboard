import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { RoomId, RoomIdTempData, RoomTemp, RoomTempCollection } from '../db/temps';
import { Dayjs } from 'dayjs';

export type SegregatedRoomTemps = Record<RoomId, RoomIdTempData[]>;

export function RoomTempModel() {
  const [startDateTime, setStartDateTime] =
    useState<Date>(new Date("2013-10-02T05:00:00"));
  const [endDateTime, setEndDateTime] =
    useState<Date>(new Date("2013-10-03T05:00:00"));
  const [sampleScale, setSampleScale] =
    useState<number>(8);
  const [visibleRooms, setVisibleRooms] =
    useState<readonly boolean[]>(
      [true, true, true, true, true, true, true]
    )

  const VALID_START_DATE = new Date("2013-10-02T05:00:00");
  const VALID_END_DATE = new Date("2013-12-03T15:30:00");

  // const MIN_SAMPLE_SIZE = 0;
  // const MAX_SAMPLE_SIZE = 12;

  type AvgTempArr = [number, number, number, number, number, number];

  function segregateTempData(roomTemps: RoomTemp[]): SegregatedRoomTemps {
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

  function handleChangeStartDateTime(input: Dayjs | string | number | null | undefined): void {
    // console.log(typeof input);
    let inputStartDateTime: Date | null = null;
    if (typeof (input) === "string" || typeof input === "number") {
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

  function handleChangeEndDateTime(input: Dayjs | string | number | null | undefined): void {
    // console.log(typeof input);
    let inputEndStartTime: Date | null = null;
    if (typeof input === "string" || typeof input === "number") {
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
    const newState = [...visibleRooms];
    const oldState = newState[roomId];
    newState[roomId] = !oldState;
    setVisibleRooms(newState);
  }

  return {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    sampleScale, setSampleScale,
    visibleRooms, handleToggleVisibleRooms,
    getRoomTemps,
  }
}