import { RoomTemp, RoomId, RoomIdTempData } from "../db/temps";

export const emptyRoomTemps: SegregatedRoomTemps = {
  "0": [],
  "1": [],
  "2": [],
  "3": [],
  "4": [],
  "5": [],
  "6": []
};

export function segregateTempData(roomTemps: RoomTemp[]): SegregatedRoomTemps {
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

export type SegregatedRoomTemps = Record<RoomId, RoomIdTempData[]>;