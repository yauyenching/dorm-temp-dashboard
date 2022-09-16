import React from 'react';
import { Button, Stack } from "@mui/material";
import { RoomId } from '../db/temps';
import { calculateAverageTemps } from '../utils/avgTemp';

export default function FloorPlan(
  { visibleRooms, handleToggleVisibleRooms, roomTemps }
) {
  const roomIds: RoomId[] = [0, 1, 2, 3, 4, 5, 6];
  const roomAvgTemps: readonly number[] = calculateAverageTemps(roomTemps);
  // console.log(roomAvgTemps);

  return (
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
  );
}