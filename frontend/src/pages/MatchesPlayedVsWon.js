import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import { getMatchesPlayedVsWon, getAvailableYears } from '../services/api';

const MatchesPlayedVsWon = () => {
  const [year, setYear] = useState('');
  const [years, setYears] = useState([]);
  const [data, setData] = useState({ labels: [], datasets: [] });
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
      const result = await getMatchesPlayedVsWon(year);
      setData(result);
      setError('');
    } catch (err) {
      setError('Failed to load data. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data.labels?.map((team, idx) => ({
    team,
    played: data.datasets?.[0]?.data[idx] || 0,
    won: data.datasets?.[1]?.data[idx] || 0,
  })) || [];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          Matches Played vs Matches Won
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Matches played and won by each team in a specific year
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
        title={`Team Performance in ${year}`}
        loading={loading}
        error={error}
      >
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" angle={-45} textAnchor="end" height={120} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="played" fill="#1976d2" name="Matches Played" />
            <Bar dataKey="won" fill="#4caf50" name="Matches Won" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Container>
  );
};

export default MatchesPlayedVsWon;
