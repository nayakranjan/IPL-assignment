import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartContainer from '../components/ChartContainer';
import { getMatchesPerYear, getMatchesWonPerTeam } from '../services/api';

const Home = () => {
  const [yearData, setYearData] = useState({ labels: [], values: [] });
  const [winsData, setWinsData] = useState({ labels: [], datasets: [] });
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');

  useEffect(() => {
    loadYearData();
    loadWinsData();
  }, []);

  const loadYearData = async () => {
    try {
      setLoading1(true);
      const data = await getMatchesPerYear();
      setYearData(data);
      setError1('');
    } catch (err) {
      setError1('Failed to load data. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading1(false);
    }
  };

  const loadWinsData = async () => {
    try {
      setLoading2(true);
      const data = await getMatchesWonPerTeam();
      setWinsData(data);
      setError2('');
    } catch (err) {
      setError2('Failed to load data. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading2(false);
    }
  };

 
  const chartData1 = yearData.labels.map((label, idx) => ({
    year: label,
    matches: yearData.values[idx],
  }));

  const chartData2 = winsData.labels?.map((team, idx) => {
    const row = { team };
    winsData.datasets?.forEach((ds) => {
      row[ds.label] = ds.data[idx];
    });
    return row;
  }) || [];

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#a4de6c', '#d084d0', '#ffbb28', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
          IPL Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Statistics and insights from IPL matches
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ChartContainer
            title="Matches Played Per Year"
            loading={loading1}
            error={error1}
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData1}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="matches" fill="#1976d2" name="Number of Matches" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>

        <Grid item xs={12}>
          <ChartContainer
            title="Matches Won by Each Team Over the Years (Stacked)"
            loading={loading2}
            error={error2}
          >
            <ResponsiveContainer width="100%" height={500}>
              <BarChart data={chartData2}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="team" angle={-45} textAnchor="end" height={150} />
                <YAxis />
                <Tooltip />
                <Legend />
                {winsData.datasets?.map((ds, idx) => (
                  <Bar key={ds.label} dataKey={ds.label} stackId="a" fill={colors[idx % colors.length]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
