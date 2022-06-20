import { useEffect, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { Container } from '@mui/system';
import SideNav from './components/SideNav';
import axios from 'axios';
import BountyCell from './components/BountyCell';

export default function Home() {
  const [bounties, setBounties] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DEV_SERVER}/api/bounties/`)
      .then((res) => setBounties(res.data))
      .catch((err) => console.log(err));
  }, []);
  console.log(bounties);
  return (
    <>
      <SideNav />
      <Container sx={{ marginLeft: '240px' }}>
        <Box>
          <Typography variant='h5'>Bounties for Hunters</Typography>
          <Typography marginTop={2} fontWeight='600' color='#757575'>
            Get paid by building out solutions for innovative companies
          </Typography>
          <Divider sx={{ marginTop: 5, marginBottom: 5 }} />
          {bounties.map((b) => (
            <BountyCell key={b.id} bounty={b} />
          ))}
        </Box>
      </Container>
    </>
  );
}
