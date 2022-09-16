import { LTTB, DataPoint, Indexable } from 'downsample';
import { RoomIdTempData } from '../db/temps'

export function calculateSampleSize(sampleScale): number {
  return Math.pow(2, sampleScale);
}

export function downsample(
  roomTemps: RoomIdTempData[], sampleScale: number
): Indexable<DataPoint> {
  const sampleSize: number = calculateSampleSize(sampleScale);
  // console.log(sampleSize);
  const roomData: DataPoint[] = roomTemps as DataPoint[];

  return LTTB(roomData, sampleSize)
}