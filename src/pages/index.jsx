import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import RichTextEditor from '../components/RichTextEditor';

export default function Home() {
  return (
    <Box>
      <Container maxWidth="lg">
        <Box>
          <Typography>Hy</Typography>
          <RichTextEditor />
        </Box>
      </Container>
    </Box>
  );
}
