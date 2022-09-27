import { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { RoomId, RoomTemp, RoomTempCollection } from '../db/temps';
import { Dayjs } from 'dayjs';
import { startParams, updatedParams } from '../utils/linkability';
import { emptyRoomTemps, SegregatedRoomTemps, segregateTempData } from '../utils/segregate';

export default function RoomTempModel(
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
  const [ roomTemps, setRoomTemps ] =
    useState<SegregatedRoomTemps>(emptyRoomTemps);

  const VALID_START_DATE = new Date("2013-10-02T05:00:00");
  const VALID_END_DATE = new Date("2013-12-03T15:30:00");

  // referenced from https://anonyfox.com/spells/meteor-react-collection-hooks/
  // https://blog.meteor.com/introducing-usetracker-react-hooks-for-meteor-cb00c16d6222
  useEffect(() => {
    console.log("Fetching RoomTempCollection...");
    Meteor.subscribe('temps', [startDateTime, endDateTime], function() {
      let roomTempsData: RoomTemp[] = RoomTempCollection.find({
        timestamp: {
          $gt: startDateTime,
          $lt: endDateTime
        }
      }).fetch();
      roomTempsData =
        roomTempsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      const roomTempsSegregated = segregateTempData(roomTempsData);
      setRoomTemps(roomTempsSegregated);
    });
  }, [startDateTime, endDateTime])

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
    changedParams, roomTemps
  }
}