import React from 'react';
import Plot from 'react-plotly.js';
import { RoomIdTempData } from '../db/temps';
import { downsample } from '../utils/sample';
import { DataPoint } from 'downsample';
import { useTracker } from 'meteor/react-meteor-data';

export default function TimeSeries(
  { startDateTime, endDateTime,
    handleChangeStartDateTime, handleChangeEndDateTime,
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
    title: 'Room Temperatures (°C)',
    colorway : ['#FE72A3', '#F89C74', '#F6CF71', '#87C55F', '#66C5CC', '#80A3EF', '#C984EB'],
    xaxis: {
      range: [startDateTime, endDateTime],
      type: 'date'
    },
    yaxis: {
      fixedrange: true,
    },
    legend: {"orientation": "h"},
    font: {
      family: 'Barlow, sans-serif',
      size: 14
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: {
      l: 25,
      r: 25,
      b: 25,
      t: 50,
      pad: 2
    }
  }

  return (
    <div className='time-series'>
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
          modeBarButtonsToRemove: ['resetScale2d', 'autoScale2d']
        }}
        useResizeHandler={true}
        style={{width: "100%", height: "100%"}}
      />
    </div>
  );
}