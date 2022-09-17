import React from 'react';
import Plot from 'react-plotly.js';
import { RoomIdTempData } from '../db/temps';
import { downsample } from '../utils/sample';
import { DataPoint } from 'downsample';
import { useTracker } from 'meteor/react-meteor-data';

export default function TimeSeries(
  { handleChangeStartDateTime, handleChangeEndDateTime,
    roomTemps, sampleScale, visibleRooms }
) {
  let data: any[] = [];

  const createGraphData = (roomData: RoomIdTempData[]) => useTracker(() => {
    const roomTempData: number[] = [];
    const roomTimeWindow: Date[] = [];
    const downsampled = downsample(roomData, sampleScale)
    for (let i = 0; i < downsampled.length; i++) {
      const dataPoint: DataPoint = downsampled[i];
      roomTimeWindow.push(dataPoint['x']);
      roomTempData.push(dataPoint['y']);
    }
    return {
      roomTimeWindow,
      roomTempData
    }
  }, [sampleScale, roomTemps, visibleRooms])

  // console.log(roomTemps);

  for (const roomId in roomTemps) {
    const roomData: RoomIdTempData[] = roomTemps[roomId];

    let { roomTimeWindow, roomTempData } = createGraphData(roomData);

    data.push({
      x: roomTimeWindow,
      y: roomTempData,
      type: 'scatter',
      mode: 'lines',
      name: `Room ${roomId}`,
      visible: visibleRooms[roomId] ? true : "legendonly"
    })
  }

  const layout = {
    width: 850,
    height: 500,
    title: 'A Fancy Plot',
    colorway : ['#FE88B1', '#F89C74', '#F6CF71', '#87C55F', '#66C5CC', '#9EB9F3', '#DCB0F2'],
    // xaxis: { bounds: [VALID_START_DATE, VALID_END_DATE] },
    yaxis: {
      fixedrange: true,
      // bounds: [7.5, 28.5]
    },
    responsive: true
  }

  return (
    <Plot
      data={data}
      layout={layout}
      onRelayout={(eventData) => {
        // console.log('x start: ' + eventData['xaxis.range[0]'] + '\n' + 'x end: ' + eventData['xaxis.range[1]']);
        handleChangeStartDateTime(eventData['xaxis.range[0]']);
        handleChangeEndDateTime(eventData['xaxis.range[1]']);
      }}
      config={{
        scrollZoom: true,
        // showLink: true
      }}
    />
  );
}