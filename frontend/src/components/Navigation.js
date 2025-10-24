import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
 

const Navigation = () => {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/extra-runs', label: 'Extra Runs' },
    { path: '/economical-bowlers', label: 'Economical Bowlers' },
    { path: '/matches-played-vs-won', label: 'Matches Stats' },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            IPL Analytics
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {links.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  backgroundColor: location.pathname === link.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
