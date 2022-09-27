import { SegregatedRoomTemps } from "../utils/segregate";

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

export function getRoomColor(roomTemp: number) {
  // hard-coded values from temperature dataset
  const AVG = 18.45405967;
  const MIN = 7.983;
  const MAX = 28.06;

  const hotterThanAvg: boolean = roomTemp > AVG;
  const tempDiff: number = Math.abs(AVG - roomTemp);
  const tempRatio: number =
    tempDiff !== 0 ?
    Math.abs(tempDiff) /
    Math.abs(AVG - (hotterThanAvg ? MAX : MIN)) :
    0

  const valueR = hotterThanAvg ? 255 : 0;
  const valueB = !hotterThanAvg ? 255 : 0;
  // cap opacity at 80% to reduce intensity of color
  // also cap to 2 dp for max CSS opacity precision
  // inspo: https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
  const opacity = +(tempRatio * 0.75).toFixed(2);

  return {
    opacity,
    valueR,
    valueB
  }
}