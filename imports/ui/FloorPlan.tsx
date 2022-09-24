import React from 'react';
import { RoomId } from '../db/temps';
import { calculateAverageTemps, getRoomColor } from '../utils/avgTemp';

export default function FloorPlan(
  { visibleRooms, handleToggleVisibleRooms, roomTemps }
) {
  const roomIds: RoomId[] = [0, 1, 2, 3, 4, 5, 6];
  const roomAvgTemps: readonly number[] = calculateAverageTemps(roomTemps);
  // console.log(roomAvgTemps);

  const rooms: JSX.Element[] =
    roomIds.map(roomId => {
      const roomClass: string =
        roomId !== 0 ? `standard room R${roomId}` : 'big room';
      const roomTemp: string =
        (!isNaN(roomAvgTemps[roomId]) ? roomAvgTemps[roomId] : 0).toFixed(1)

      const { opacity, valueR, valueB } = getRoomColor(roomAvgTemps[roomId])

      const roomStyle =
        visibleRooms[roomId] ? {
          background: `rgba(${valueR}, 55, ${valueB}, ${opacity})`,
          transition: 'box-shadow 0.1s ease-out, background-color 0.3s ease-in-out'
        } : {
          background: 'hsla(0, 0%, 66%, 0.8)',
          color: '#e1e1e1',
          transition: 'box-shadow 0.1s ease-out'
        }

      return (
        <div
          key={roomId}
          className={roomClass}
          onClick={() => { handleToggleVisibleRooms(roomId) }}
          style={roomStyle}
        >
          R{roomId}
          <div className='subtitle'>{roomTemp}</div>
        </div>
      );
    })

  return (
    <div className='base floor-plan'>
      <div className='big room'></div>
      <div className='column decorative' />
      <div className='closet decorative c1' />
      <div className='closet decorative c2' />
      <div className='decorative-room' />
      {/* {roomIds.map(roomId => <div className={`standard room R${roomId}`} />)} */}
      {rooms}
    </div>
  );
}