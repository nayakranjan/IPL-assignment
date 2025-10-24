import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import { getEconomicalBowlers, getAvailableYears } from '../services/api';

const EconomicalBowlers = () => {
  const [year, setYear] = useState('');
  const [years, setYears] = useState([]);
  const [data, setData] = useState({ labels: [], values: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (year) {
      fetchData();
    }
  }, [year]);

  const fetchAvailableYears = async () => {
    try {
      const yrs = await getAvailableYears();
      setYears(yrs);
      if (yrs.length > 0) {
        setYear(yrs[yrs.length - 1]); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getEconomicalBowlers(year);
      setData(result);
      setError('');
    } catch (err) {
      setError('Failed to load data. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data.labels.map((label, idx) => ({
    bowler: label,
    economy: data.values[idx],
  }));

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Top Economical Bowlers
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Top 10 most economical bowlers in a specific year (minimum 4 overs)
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Year</InputLabel>
          <Select
            value={year}
            label="Select Year"
            onChange={(e) => setYear(e.target.value)}
          >
            {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <ChartContainer
        title={`Top 10 Economical Bowlers in ${year}`}
        loading={loading}
        error={error}
      >
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bowler" angle={-45} textAnchor="end" height={150} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="economy" fill="#82ca9d" name="Economy Rate" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default EconomicalBowlers;
