import React from 'react';
import Plot from 'react-plotly.js';
import { RoomTemp } from '../db/temps';

export const Graph = ({ handleChangeStartDateTime, handleChangeEndDateTime, getRoomTemps }) => {
  // const startDateTime = props.startDateTime;
  // const endDateTime = props.endDateTime;

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

  const { isLoading, roomTemps } = getRoomTemps();
  // console.log(isLoading);
  if (!isLoading) {

    function segregateTempData(roomTemps: RoomTemp[], property: keyof RoomTemp) {
      return roomTemps.reduce((acc, roomTemp) => {
        const key = roomTemp.roomId;
        // console.log(key);
        // console.log(roomTemp[property]);
        acc[Number(key)] ??= [];
        acc[Number(key)].push(roomTemp[property]);
        return acc;
      }, {});
    }

    const roomTempData = segregateTempData(roomTemps, "temperature");
    const timeWindow = segregateTempData(roomTemps, "timestamp")
    // console.log(timeWindow['0']);
    // console.log(roomTempData);

    for (const roomId in roomTempData) {
      data.push({
        x: timeWindow[roomId],
        y: roomTempData[roomId],
        type: 'scatter',
        mode: 'lines',
        name: `Room ${roomId}`
      })
    }
  }
  // console.log(data)
  // let data = [r0, r1, r2, r3, r4, r5, r6];

  const layout = {
    width: 800,
    height: 500,
    title: 'A Fancy Plot',
    yaxis: {
      fixedrange: true
    }
    // responsive: true
  }

  return (
    // <div>
    //   { isLoading ? (
    //     <div className='loader'></div>
    //   ) : (
    <Plot
      data={data}
      layout={layout}
      onRelayout={(eventData) => {
        handleChangeStartDateTime(eventData['xaxis.range[0]']);
        handleChangeEndDateTime(eventData['xaxis.range[1]']);
        // alert( 'ZOOM!' + '\n\n' +
        //     'Event data:' + '\n' +
        //      JSON.stringify(eventData) + '\n\n' +
        //     //  + typeof(eventData['xaxis.range[0]'])
        //     'x-axis start:' + (new Date(eventData['xaxis.range[0]'])) + '\n' +
        //     'x-axis end:' + (new Date(eventData['xaxis.range[1]'])) );
      }}
    />
    //   )}
    // </div>
  );
}