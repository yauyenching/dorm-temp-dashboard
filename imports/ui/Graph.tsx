import React from 'react';
import Plot from 'react-plotly.js';
import { RoomId, RoomIdTempData } from '../db/temps';

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

  // const roomTempData = segregateTempData(roomTemps, "temperature");
  // const timeWindow = segregateTempData(roomTemps, "timestamp")
  // console.log(timeWindow['0']);
  // console.log(roomTempData);

  const { isLoading, roomTemps } = getRoomTemps();

  if (!isLoading) {
    for (const roomId in roomTemps) {
      const roomData: RoomIdTempData[] = roomTemps[roomId];
      const roomTimeWindow: Date[] = [];
      const roomTempData: Number[] = [];

      roomData.forEach(e => {
        roomTimeWindow.push(e.x);
        roomTempData.push(e.y);
      })

      data.push({
        x: roomTimeWindow,
        y: roomTempData,
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