import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { AutoFixHigh } from '@mui/icons-material';
import PropTypes from 'prop-types';

const Navbar = ({ bgImage }) => (
  <Box
    sx={{
      backgroundColor: bgImage ? 'transparent' : '#f5f5f5',
      borderBottom: bgImage ? 'transparent' : '2px solid #e8e8e8',
      position: 'absolute',
      width: '100%',
    }}
  >
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '60px',
          px: '50px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              color: '#475266',
              fontSize: '22px',
            }}
          >
            Rich Text Editor
          </Typography>
          <AutoFixHigh
            sx={{
              ml: '7px',
              width: '24px',
              height: 'auto',
              color: '#475266',
              rotate: '180deg',
            }}
          />
        </Box>
        <Box onClick={() => window.open('https://docs.slatejs.org/')}>
          <Typography
            sx={{
              cursor: 'pointer',
              fontWeight: 300,
              color: '#475266',
              fontSize: '16px',
              '&:hover': {
                color: '#000',
              },
            }}
          >
            Powered by Slate.js
          </Typography>
        </Box>
      </Box>
    </Container>
  </Box>
);

Navbar.propTypes = {
  bgImage: PropTypes.string,
};

export default Navbar;
