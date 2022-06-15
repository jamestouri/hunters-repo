import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Divider, Typography } from '@mui/material';
import { capitalizeFirstLetter, timeFromUpdateUtil,walletAddressShortener } from '../utils/helpers';

const experienceLevelEmoji = {
  beginner: '🟢',
  intermediate: '🟦',
  advanced: '♦',
};

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
      <Box display='flex' alignItems='center'>
        <Box
          height={80}
          width={80}
          borderRadius={50}
          backgroundColor='#1DB3F9'
        />
        <Box marginLeft={2}>
          <Box display='flex' alignItems='center' marginBottom={1}>
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
      <Box display='flex' marginTop={4} justifyContent='space-between'>
        <Box display='flex'>
          <Funder bountyAddress={bounty.bounty_creator} />
          <CreatorContactInfo contactInfo={bounty.ways_to_contact} />
        </Box>
        <Box display='flex'>
          <ExperienceLevel experienceLevel={bounty.experience_level} />
          <TimeCommitment timeCommitment={bounty.project_length} />
          <WhenCreated timeLapse={bounty.updated_at} />
        </Box>
      </Box>
      <Button
        variant='contained'
        sx={{
          marginTop: 4,
          borderRadius: 0,
          boxShadow: 'none',
          backgroundColor: '#1db3f9',
        }}
      >
        Start Project
      </Button>
      <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
      <Typography variant='h6' fontWeight='500'>
        Description
      </Typography>
      <Typography marginTop={2}>{bounty.description}</Typography>
    </Container>
  );
}

function BountyCategories({ categories }) {
  return (
    <Box display='flex'>
      {categories.map((c) => (
        <Typography
          key={c}
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

function Funder({ bountyAddress }) {
  return (
    <Box marginRight={3}>
      <Typography color='#757575' fontWeight='600'>
        Funder
      </Typography>
      <Button sx={{padding: 0, fontSize: 16}}> {walletAddressShortener(bountyAddress) }</Button>
    </Box>
  );
}

function CreatorContactInfo({ contactInfo }) {
  return (
    <Box marginRight={2}>
      <Typography color='#757575' fontWeight='600'>
        Point of Contact
      </Typography>
      <Typography>✉️ {contactInfo}</Typography>
    </Box>
  );
}

function ExperienceLevel({ experienceLevel }) {
  return (
    <Box marginRight={2}>
      <Typography color='#757575' fontWeight='600'>
        Experience Level
      </Typography>
      <Typography>
        {experienceLevelEmoji[experienceLevel]}{' '}
        {capitalizeFirstLetter(experienceLevel)}
      </Typography>
    </Box>
  );
}

function TimeCommitment({ timeCommitment }) {
  return (
    <Box marginRight={2}>
      <Typography color='#757575' fontWeight='600'>
        Est. Length of Project
      </Typography>
      <Typography>⏱ {timeCommitment}</Typography>
    </Box>
  );
}

function WhenCreated({ timeLapse }) {
  return (
    <Box>
      <Typography color='#757575' fontWeight='600'>
        Creation Date
      </Typography>
      <Typography>🗓 {timeFromUpdateUtil(timeLapse)}</Typography>
    </Box>
  );
}
