import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import Plot from 'react-plotly.js';
import { RoomTemp, RoomTempCollection } from '../db/temps';

export const Graph = () => {
  const startDateTime = new Date("2013-10-02T05:00:00");
  const endDateTime = new Date("2013-10-03T05:00:00");

  // referenced from https://anonyfox.com/spells/meteor-react-collection-hooks/
  // https://blog.meteor.com/introducing-usetracker-react-hooks-for-meteor-cb00c16d6222
  const useRoomTemps = () => useTracker(() => {
    console.log("Fetching RoomTempCollection...");
    const handler: Meteor.SubscriptionHandle = Meteor.subscribe('temps');
    const roomTemps = RoomTempCollection.find({
      timestamp: {
        $gt: startDateTime,
        $lt: endDateTime
      }
    }).fetch()
    return {
      roomTemps,
      isLoading: !handler.ready()
    }
  }, [])

  // console.log(RoomTempCollection.find().count())
  // let query = RoomTempCollection.find({
  //   timestamp: {
  //     $gt: startDateTime,
  //     $lt: endDateTime
  //   }
  // })
  // console.log(query.count());
  // let roomTemps = query.fetch();

  let data: any[] = [];

  const { isLoading, roomTemps } = useRoomTemps();
  if (roomTemps !== null) {
    let timeWindow: Date[] = roomTemps.map(roomTemp => roomTemp.timestamp)

    function segregateTempData(roomTemps: RoomTemp[], property: keyof RoomTemp) {
      return roomTemps.reduce((acc, roomTemp) => {
        const key = roomTemp[property];
        acc[Number(key)] ??= [];
        acc[Number(key)].push(roomTemp.temperature);
        return acc;
      }, {});
    }

    const roomTempData = segregateTempData(roomTemps, "roomId");
    console.log(roomTempData);

    for (const roomId in roomTempData) {
      data.push({
        x: timeWindow,
        y: roomTempData[roomId],
        type: 'scatter',
        mode: 'lines'
      })
    }
  }
  // let data = [r0, r1, r2, r3, r4, r5, r6];

  return (
    // <div>
    //   { isLoading ? (
    //     <div className='loader'></div>
    //   ) : (
    <Plot
      data={data}
      layout={{ width: 800, height: 500, title: 'A Fancy Plot' }}
    />
    //   )}
    // </div>
  );
}