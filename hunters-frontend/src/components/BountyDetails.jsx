import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography } from '@mui/material';

export default function BountyDetails() {
  const params = useParams();
  const [bounty, setBounty] = useState(null);

  const bountyId = params.bountyId;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bountyId}/`)
      .then((res) => setBounty(res.data))
      .catch((err) => console.log('😢 ' + err));
  }, []);
  if (bounty == null) {
    return null;
  }
  return (
    <Container>
      <Box display='flex'>
        <Box
          height={80}
          width={80}
          borderRadius={50}
          backgroundColor='#1DB3F9'
        />
        <Box marginLeft={2}>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant='h6'>{bounty.title}</Typography>
            <Box display='flex'>
              <Typography
                color='#9f29bc'
                height={25}
                paddingLeft={2}
                paddingRight={2}
                backgroundColor='rgb(144,44,204, 0.3)'
              >
                {bounty.bounty_value_in_usd} USD
              </Typography>
              <Typography
                marginLeft={1}
                color='#e41f66'
                height={25}
                paddingLeft={2}
                paddingRight={2}
                backgroundColor='rgb(228,31,102, 0.3)'
              >
                Paid out in ETH
              </Typography>
            </Box>
          </Box>
          <BountyCategories categories={bounty.bounty_category} />
        </Box>
      </Box>
    </Container>
  );
}

function BountyCategories({ categories }) {
  return (
    <Box display='flex'>
      {categories.map((c) => (
        <Typography
          color='#1db3f9'
          backgroundColor='rgb(29,179,249, 0.3)'
          paddingLeft={1}
          paddingRight={1}
          marginRight={1}
        >
          {c}
        </Typography>
      ))}
    </Box>
  );
}
