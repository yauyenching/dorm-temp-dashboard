import React from 'react';
import { Button, Stack, Box } from "@mui/material";
import { RoomId } from '../db/temps';
import { calculateAverageTemps } from '../utils/avgTemp';
// import './FloorPlanStyle.css';

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
      return (
        <div
          className={roomClass}
          onClick={() => { handleToggleVisibleRooms(roomId) }}
        >
          R{roomId}
        </div>
      );
    })

  return (
    <>
      <div>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            {roomIds.map(roomId =>
              <Button
                key={roomId}
                variant="contained"
                onClick={() => {
                  handleToggleVisibleRooms(roomId);
                }}
              >
                Room {roomId} ({(!isNaN(roomAvgTemps[roomId]) ? roomAvgTemps[roomId] : 0).toFixed(2)})
              </Button>)}
          </Stack>
        </Stack>
      </div>
      <div className='base floor-plan'>
        <div className='column decorative' />
        <div className='closet decorative' style={{ "left": "18px" }} />
        <div className='closet decorative' style={{ "left": "95px" }} />
        <div className='decorative-room' />
        {rooms}
      </div>
    </>
  );
}