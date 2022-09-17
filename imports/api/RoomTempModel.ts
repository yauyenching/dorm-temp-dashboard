import { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { RoomId, RoomIdTempData, RoomTemp, RoomTempCollection } from '../db/temps';
import { Dayjs } from 'dayjs';
import { startParams, changedParam } from '../utils/linkability';

export type SegregatedRoomTemps = Record<RoomId, RoomIdTempData[]>;

export function RoomTempModel(
  loadParams: Partial<startParams>
) {
  const [startDateTime, setStartDateTime] =
    useState<Date>(loadParams.start ?? new Date("2013-10-02T05:00:00"));
  const [endDateTime, setEndDateTime] =
    useState<Date>(loadParams.end ?? new Date("2013-10-03T05:00:00"));
  const [sampleScale, setSampleScale] =
    useState<number>(loadParams.sample ?? 8);
  const [visibleRooms, setVisibleRooms] =
    useState<boolean[]>(
      loadParams.visible ?? [true, true, true, true, true, true, true]
    );
  const [changedParam, setChangedParam] =
    useState<changedParam>({} as changedParam);

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
    let roomTempsData: RoomTemp[] = RoomTempCollection.find({
      timestamp: {
        $gt: startDateTime,
        $lt: endDateTime
      }
    }).fetch()
    roomTempsData =
      roomTempsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
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
      setStartDateTime(inputStartDateTime);
      setChangedParam('start');
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
      setEndDateTime(inputEndStartTime);
      setChangedParam('end');
      // console.log(endDateTime)
    }
    // console.log(`endDateTime: ${endDateTime}`);
  }

  function handleChangeSampleSize(sampleScale: number): void {
    setSampleScale(sampleScale);
    setChangedParam('sample');
  }

  function handleToggleVisibleRooms(roomId: RoomId): void {
    const newState = [...visibleRooms];
    const oldState = newState[roomId];
    newState[roomId] = !oldState;
    setVisibleRooms(newState);
    setChangedParam('visible');
  }

  return {
    startDateTime, handleChangeStartDateTime,
    endDateTime, handleChangeEndDateTime,
    sampleScale, handleChangeSampleSize,
    visibleRooms, handleToggleVisibleRooms,
    changedParam, setChangedParam,
    getRoomTemps,
  }
}