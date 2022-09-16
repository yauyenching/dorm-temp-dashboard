import { SegregatedRoomTemps } from "../api/RoomTempModel";

export function calculateAverageTemps(
  segregatedRoomTemps: SegregatedRoomTemps
): readonly number[] {
  const roomAvgTemps: number[] = [];

  for (const roomId in segregatedRoomTemps) {
    const roomTemps = segregatedRoomTemps[roomId];
    const dataLength = roomTemps.length;
    const sum = roomTemps.reduce(
      (acc, roomIdTempData) => {
        const temp = roomIdTempData.y;
        return acc + temp
      },
      0
    );
    roomAvgTemps.push(sum / dataLength);
  }
  return roomAvgTemps;
}