import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import ExtraRuns from './pages/ExtraRuns';
import EconomicalBowlers from './pages/EconomicalBowlers';
import MatchesPlayedVsWon from './pages/MatchesPlayedVsWon';


const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/extra-runs" element={<ExtraRuns />} />
          <Route path="/economical-bowlers" element={<EconomicalBowlers />} />
          <Route path="/matches-played-vs-won" element={<MatchesPlayedVsWon />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
