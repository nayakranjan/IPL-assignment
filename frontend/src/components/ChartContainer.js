import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

const ChartContainer = ({ title, loading, error, children }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2, minHeight: 400 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        {title}
      </Typography>
      
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {!loading && !error && children}
    </Paper>
  );
};

export default ChartContainer;
