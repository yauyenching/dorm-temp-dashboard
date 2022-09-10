import { Mongo } from 'meteor/mongo';

export interface RoomTemp {
  room_id: number,
  timestamp: Date,
  temperature: number
}

export const RoomTempCollection = new Mongo.Collection<RoomTemp>('temps');
