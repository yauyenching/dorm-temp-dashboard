import React, { useEffect } from 'react';
import Plot from 'react-plotly.js';
import { RoomIdTempData } from '../db/temps';
import { downsample } from '../utils/sample';
import { DataPoint } from 'downsample';
import { useTracker } from 'meteor/react-meteor-data';

export default function Graph(
  { handleChangeStartDateTime, handleChangeEndDateTime, roomTemps, sampleScale }
) {
  let data: any[] = [];

  for (const roomId in roomTemps) {
    const roomData: RoomIdTempData[] = roomTemps[roomId];

    const createGraphData = () => useTracker(() => {
      const roomTempData: Number[] = [];
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
    }, [sampleScale, roomTemps])

    const { roomTimeWindow, roomTempData } = createGraphData();

    data.push({
      x: roomTimeWindow,
      y: roomTempData,
      type: 'scatter',
      mode: 'lines',
      name: `Room ${roomId}`
    })
  }

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
    <Plot
      data={data}
      layout={layout}
      onRelayout={(eventData) => {
        handleChangeStartDateTime(eventData['xaxis.range[0]']);
        handleChangeEndDateTime(eventData['xaxis.range[1]']);
      }}
    />
  );
}