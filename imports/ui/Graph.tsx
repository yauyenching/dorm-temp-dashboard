import React from 'react';
import Plot from 'react-plotly.js';
import { RoomId, RoomTemp, RoomTempCollection } from '../db/temps';

export const Graph = () => {
  const startDateTime = new Date("2013-10-02T05:00:00");
  const endDateTime = new Date("2013-10-03T05:00:00");

  let roomTemps: RoomTemp[] = RoomTempCollection.find({
    timestamp: {
      $gt: startDateTime,
      $lt: endDateTime
    }
  }).fetch()
  console.log(roomTemps)
  let timeWindow: Date[] = roomTemps.map(roomTemp => roomTemp.timestamp)

  function segregateTempData(roomTemps: RoomTemp[], property: keyof RoomTemp) {
    return roomTemps.reduce((acc, roomTemp) => {
      const key = roomTemp[property];
      acc[Number(key)] ??= [];
      acc[Number(key)].push(roomTemp.temperature);
      return acc;
    }, {});
  }

  const roomTempData = segregateTempData(roomTemps, "room_id");
  // console.log(typeof Object.keys(roomTempData)[0])

  let r0 = {
    x: timeWindow,
    y: roomTempData['0'],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'red' },
  };

  let r1 = {
    x: timeWindow,
    y: roomTempData['1'],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'orange' },
  };

  let r2 = {
    x: timeWindow,
    y: roomTempData['2'],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'yellow' },
  };

  let r3 = {
    x: timeWindow,
    y: roomTempData['3'],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'green' },
  };

  let r4 = {
    x: timeWindow,
    y: roomTempData['4'],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'blue' },
  };

  let r5 = {
    x: timeWindow,
    y: roomTempData['5'],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'purple' },
  };

  let r6 = {
    x: timeWindow,
    y: roomTempData['6'],
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'pink' },
  };

  let data = [r0, r1, r2, r3, r4, r5, r6];

  return (
    <Plot
      data={data}
      layout={{ width: 800, height: 500, title: 'A Fancy Plot' }}
    />
  );
}