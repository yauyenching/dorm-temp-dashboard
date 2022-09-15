import { Mongo } from 'meteor/mongo';

export type RoomId = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface RoomIdTempData {
  x: Date,
  y: Number
}

export interface RoomTemp {
  roomId: RoomId,
  timestamp: Date,
  temperature: number
}

export const RoomTempCollection = new Mongo.Collection<RoomTemp>('temps');