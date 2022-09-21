import React from 'react';
import { Grid, Typography, Input, Box, Slider, Stack } from '@mui/material';
import { calculateSampleSize } from '../utils/sample'

function valuetext(value: number) {
  return `${value}°C`;
}

export default function SampleSlider({ sampleScale, handleChangeSampleSize }) {
  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <Typography id="sample-slider" gutterBottom>
          Sample Size
        </Typography>
        <Typography sx={{ border: 1, px: 1, width: 40, borderColor: '#4C60A9' }}>
          {calculateSampleSize(sampleScale)}
        </Typography>
      </Stack>
      <Slider
        aria-label="Sample Size"
        aria-labelledby="sample-slider"
        value={sampleScale}
        onChange={(_, value) => handleChangeSampleSize(value)}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) =>`2^${value}`}
        step={1}
        marks
        min={2}
        max={12}
      />
    </Box>
  );
}