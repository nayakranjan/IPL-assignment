import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// APIs
export const getMatchesPerYear = async () => {
  const res = await api.get('/matches-per-year/');
  return res.data;
};

export const getMatchesWonPerTeam = async () => {
  const res = await api.get('/matches-won-per-team/');
  return res.data;
};

export const getExtraRunsPerTeam = async (year) => {
  const res = await api.get(`/extra-runs/${year}/`);
  return res.data;
};

export const getEconomicalBowlers = async (year) => {
  const res = await api.get(`/economical-bowlers/${year}/`);
  return res.data;
};

export const getMatchesPlayedVsWon = async (year) => {
  const res = await api.get(`/matches-played-vs-won/${year}/`);
  return res.data;
};

export const getAvailableYears = async () => {
  const res = await api.get('/available-years/');
  return res.data;
};

export default api;
