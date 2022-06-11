import { Box, Typography } from '@mui/material';
import { Container } from '@mui/system';
import SideNav from './components/SideNav';

export default function Home() {
  return (
    <>
    <SideNav />
      <Container sx={{marginLeft: '240px'}}>
        <Box>
          <Typography>Bounties for Hunters</Typography>
          <Typography>
            Get paid by building out solutions for innovative companies
          </Typography>
        </Box>
      </Container>
    </>
  );
}
