import { useEffect, useState, useReducer } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { Container } from '@mui/system';
import SideNav from './components/SideNav';
import axios from 'axios';
import BountyCell from './components/BountyCell';
import sideNavReducer from './reducers/sideNavReducer';

// const initialFilterState = {
//   timeCommitment: [],
//   experienceLevel: [],
//   statusBar: [],
//   daos: [],
// };

export default function Home() {
  const [bounties, setBounties] = useState([]);
  // TODO Add sideNav for filtering when needed. For now there aren't that many 
  // bounties to filter through
  // const [state, dispatch] = useReducer(sideNavReducer, initialFilterState);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/bounties/`
      )
      .then((res) => setBounties(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      {/* <SideNav dispatch={dispatch} /> */}
      <Container sx={{ marginLeft: '240px' }}>
        <Box>
          <Typography variant='h4'>Hunters</Typography>
          <Typography marginTop={2} fontWeight='600' color='#757575'>
            Get paid experience by building out solutions for innovative
            companies
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
