import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { Logo } from '../utils/images';

export default function Footer() {
  return (
    <Container>
      <Box
        marginTop={5}
        marginBottom={5}
        width='100%'
        height={120}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
      >
        <Logo />
        <Typography color={'main'}>Copyright © Unwall xyz inc.</Typography>
      </Box>
    </Container>
  );
}
