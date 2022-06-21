import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, CardMedia, Divider, Typography } from '@mui/material';
import {
  capitalizeFirstLetter,
  timeFromUpdateUtil,
  walletAddressShortener,
} from '../utils/helpers';
import { useProfile } from '../contexts/ProfileContext';
import ImageEnlargeModal from './modals/ImageEnlargeModal';
import { ActivityCell } from './ActivityCell';
import WalletModal from './modals/WalletModal';
import MDEditor from '@uiw/react-md-editor';

const experienceLevelEmoji = {
  Beginner: '🟢',
  Intermediate: '🟦',
  Advanced: '♦',
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
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex'>
          <Box
            height={80}
            width={80}
            borderRadius={50}
            backgroundColor='#1DB3F9'
          />
          <Box marginLeft={2}>
            <Typography variant='h6' marginBottom={2}>
              {bounty.title}
            </Typography>
            <BountyCategories categories={bounty.bounty_category} />
          </Box>
        </Box>
        <Box>
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
      </Box>
      <Box display='flex' marginTop={4} justifyContent='space-between'>
        <Box display='flex'>
          <Funder bountyAddress={bounty.bounty_creator} />
          <CreatorContactInfo contactInfo={bounty.ways_to_contact} />
        </Box>
        <Box display='flex'>
          <WorkingOnBounty bountyOwnersWallets={bounty.bounty_owner_wallet} />
          <ExperienceLevel experienceLevel={bounty.experience_level} />
          <TimeCommitment timeCommitment={bounty.project_length} />
          <WhenCreated timeLapse={bounty.updated_at} />
        </Box>
      </Box>
      <ButtonActionsLogic bounty={bounty} setBounty={setBounty} />
      <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
      <Typography variant='h6' fontWeight='500'>
        Description
      </Typography>
      <MDEditor.Markdown
        style={{ padding: 15 }}
        source={bounty.description}
        linkTarget='_blank'
      />
      <FilesAndImages imageAttachments={bounty.image_attachments} />
      <Activities bountyId={bounty.id} />
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

function WorkingOnBounty({ bountyOwnersWallets }) {
  if (bountyOwnersWallets.length < 1) {
    return null;
  }
  return (
    <Box marginRight={2}>
      <Typography color='#757575' fontWeight='600'>
        Working on Bounty
      </Typography>
      <Box>
        {bountyOwnersWallets.map((w) => (
          <Button key={w.id} sx={{ padding: 0, fontSize: 16 }}>
            {walletAddressShortener(w)}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

function ExperienceLevel({ experienceLevel }) {
  const experienceCapitalized = capitalizeFirstLetter(experienceLevel);
  return (
    <Box marginRight={2}>
      <Typography color='#757575' fontWeight='600'>
        Experience Level
      </Typography>
      <Typography>
        {experienceLevelEmoji[experienceCapitalized]} {experienceCapitalized}
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

function ButtonActionsLogic({ bounty, setBounty }) {
  const { walletAddress } = useProfile();
  const { bounty_creator, bounty_owner_wallet } = bounty;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAcceptWork = async () => {
    if (walletAddress == null) {
      handleOpen();
    } else {
      const bountyOwners = [...bounty.bounty_owner_wallet, walletAddress];
      const startedActivity = {
        bounty: bounty.id,
        wallet_address: walletAddress,
        activity_type: 'Started Work',
      };
      axios
        .patch(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bounty.id}/`, {
          bounty: { bounty_owner_wallet: bountyOwners },
          activities: startedActivity,
        })
        .then((res) => setBounty(res.data))
        .catch((err) => console.log(err));
    }
  };

  const handleleavingBounty = async () => {
    const removingBountyOwner = bounty.bounty_owner_wallet.filter(
      (o) => o !== walletAddress
    );
    const leaveActivity = {
      bounty: bounty.id,
      wallet_address: walletAddress,
      activity_type: 'Left Project',
    };
    axios
      .patch(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bounty.id}/`, {
        bounty: { bounty_owner_wallet: removingBountyOwner },
        activities: leaveActivity,
      })
      .then((res) => setBounty(res.data))
      .catch((err) => console.log(err));
  };

  if (bounty_creator === walletAddress) {
    return (
      <Link
        to={`/bounty/${bounty.id}/submissions/`}
        style={{ textDecoration: 'none' }}
      >
        <Button
          variant='contained'
          sx={{
            marginTop: 4,
            marginRight: 2,
            borderRadius: 0,
            boxShadow: 'none',
            backgroundColor: '#1db3f9',
          }}
        >
          Project Submissions
        </Button>
      </Link>
    );
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
    <>
      <WalletModal open={open} handleClose={handleClose} />
      <Button
        onClick={handleAcceptWork}
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
    </>
  );
}

function FilesAndImages({ imageAttachments }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
      <Typography variant='h6' fontWeight='500' sx={{ marginBottom: 3 }}>
        File Attachments
      </Typography>
      <Box display='flex' flexWrap='wrap'>
        {imageAttachments.map((imageURL) => (
          <React.Fragment key={imageURL}>
            <ImageEnlargeModal
              imageURL={imageURL}
              open={open}
              handleClose={handleClose}
            />
            <CardMedia
              component='img'
              onClick={handleOpen}
              sx={{
                width: 100,
                height: 100,
                marginRight: 5,
                cursor: 'pointer',
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: 'rgb(22,22,22, 0.2)',
              }}
              image={imageURL}
            />
          </React.Fragment>
        ))}
      </Box>
    </>
  );
}

function Activities({ bountyId }) {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/activities?bounty_id=${bountyId}`
      )
      .then((res) => setActivities(res.data))
      .catch((err) => console.log(err));
  }, []);
  if (activities == null) {
    return null;
  }
  return (
    <>
      <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
      <Typography variant='h6' fontWeight='500' sx={{ marginBottom: 3 }}>
        Activity History
      </Typography>
      <Box>
        {activities.map((a) => (
          <ActivityCell key={a.id} activity={a} />
        ))}
      </Box>
    </>
  );
}
