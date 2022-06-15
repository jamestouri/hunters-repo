import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Divider, Typography } from '@mui/material';
import {
  capitalizeFirstLetter,
  timeFromUpdateUtil,
  walletAddressShortener,
} from '../utils/helpers';
import { useProfile } from '../contexts/ProfileContext';

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
      <ButtonActionsLogic
        bounty={bounty}
        setBounty={setBounty}
        bountyId={bountyId}
      />
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
      <Button sx={{ padding: 0, fontSize: 16 }}>
        {' '}
        {walletAddressShortener(bountyAddress)}
      </Button>
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

function ButtonActionsLogic({ bounty, setBounty, bountyId }) {
  const { walletAddress } = useProfile();
  const { bounty_creator, bounty_owner_wallet } = bounty;

  const handleAcceptedWork = async () => {
    const bountyOwners = [...bounty.bounty_owner_wallet, walletAddress];
    axios
      .patch(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bountyId}/`, {
        bounty: { bounty_owner_wallet: bountyOwners },
      })
      .then((res) => setBounty(res.data))
      .catch((err) => console.log(err));
    axios
      .post(`${process.env.REACT_APP_DEV_SERVER}/api/activities/`, {
        activities: {
          bounty: bounty.id,
          wallet_address: walletAddress,
          activity_type: 'Started Work',
        },
      })
      .then((res) => console.log('⛷ activity created', res))
      .catch((err) => console.log(err));
  };

  const handleleavingBounty = async () => {
    const removingBountyOwner = bounty.bounty_owner_wallet.filter(
      (o) => o !== walletAddress
    );
    axios
      .patch(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bountyId}/`, {
        bounty: { bounty_owner_wallet: removingBountyOwner },
      })
      .then((res) => setBounty(res.data))
      .catch((err) => console.log(err));
    axios
      .post(`${process.env.REACT_APP_DEV_SERVER}/api/activities/`, {
        activities: {
          bounty: bounty.id,
          wallet_address: walletAddress,
          activity_type: 'Left Project',
        },
      })
      .then((res) => console.log('⛷ activity created', res))
      .catch((err) => console.log(err));
  };

  if (bounty_creator === walletAddress) {
      return null;
  }

  if (bounty_owner_wallet.includes(walletAddress)) {
    return (
      <>
        <Button
          variant='outlined'
          sx={{
            marginTop: 4,
            marginRight: 2,
            borderRadius: 0,
            boxShadow: 'none',
            color: '#1db3f9',
            borderColor: '#1db3f9',
          }}
        >
          Submit Project
        </Button>
        <Button
          onClick={handleleavingBounty}
          variant='outlined'
          color='secondary'
          sx={{
            borderColor: '#fb1c48',
            color: '#fb1c48',
            marginTop: 4,
            borderRadius: 0,
            boxShadow: 'none',
          }}
        >
          Leave Bounty
        </Button>
      </>
    );
  }

  return (
    <Button
      onClick={handleAcceptedWork}
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
  );
}
