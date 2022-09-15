import React from 'react';
import { Grid, Typography, Input, Box, Slider } from '@mui/material';
import { calculateSampleSize } from '../utils/sample'

function valuetext(value: number) {
  return `${value}°C`;
}

export default function SampleSlider({ sampleScale, setSampleScale }) {
  return (
    <Box sx={{ width: 300 }}>
      <Typography id="sample-slider" gutterBottom>
        Sample Size
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Slider
            aria-label="Sample Size"
            aria-labelledby="sample-slider"
            value={sampleScale}
            onChange={(_, value) => setSampleScale(value)}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) =>`2^${value}`}
            step={1}
            marks
            min={2}
            max={12}
          />
        </Grid>
        <Grid item xs={2}>
          <Typography>
            {calculateSampleSize(sampleScale)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}