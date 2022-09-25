import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { RoomId, RoomIdTempData, RoomTemp, RoomTempCollection } from '../db/temps';
import { Dayjs } from 'dayjs';
import { startParams, updatedParams } from '../utils/linkability';

export type SegregatedRoomTemps = Record<RoomId, RoomIdTempData[]>;

export function RoomTempModel(
  loadParams: Partial<startParams>
) {
  const [startDateTime, setStartDateTime] =
    useState<Date>(loadParams.start ?? new Date("2013-11-01T05:00:00"));
  const [endDateTime, setEndDateTime] =
    useState<Date>(loadParams.end ?? new Date("2013-11-02T05:00:00"));
  const [sampleScale, setSampleScale] =
    useState<number>(loadParams.sample ?? 8);
  const [visibleRooms, setVisibleRooms] =
    useState<boolean[]>(
      loadParams.visible ?? [true, true, true, true, true, true, true]
    );
  const [changedParams, setChangedParams] =
    useState<updatedParams>({} as updatedParams);

  const VALID_START_DATE = new Date("2013-10-02T05:00:00");
  const VALID_END_DATE = new Date("2013-12-03T15:30:00");

  function segregateTempData(roomTemps: RoomTemp[]): SegregatedRoomTemps {
    return roomTemps.reduce((acc, roomTemp) => {
      const key = roomTemp.roomId;
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
      Meteor.subscribe('temps');
    return !handler.ready()
  }, [])

  // Functional state updates referenced from 
  // https://stackoverflow.com/questions/58193166/usestate-hook-setter-incorrectly-overwrites-state
  function handleChangeStartDateTime(input: Dayjs | string | number | null | undefined): void {
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
      setStartDateTime(inputStartDateTime);
      setChangedParams(params => ({...params, start: true}));
    }
  }

  function handleChangeEndDateTime(input: Dayjs | string | number | null | undefined): void {
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
      setEndDateTime(inputEndStartTime);
      setChangedParams(params => ({...params, end: true}));
    }
  }
  
  function handleChangeSampleSize(sampleScale: number): void {
    setSampleScale(sampleScale);
    setChangedParams(params => ({...params, sample: true}));
  }
  
  function handleToggleVisibleRooms(roomId: RoomId): void {
    const newState = [...visibleRooms];
    const oldState = newState[roomId];
    newState[roomId] = !oldState;
    setVisibleRooms(newState);
    setChangedParams(params => ({...params, visible: true}));
  }

  return {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    sampleScale, handleChangeSampleSize,
    visibleRooms, handleToggleVisibleRooms,
    changedParams, getRoomTemps,
    segregateTempData
  }
}