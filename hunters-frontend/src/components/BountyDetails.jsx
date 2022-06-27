import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  CardMedia,
  Divider,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
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
import { BACKGROUND_COLOR } from '../utils/constants';
import ProfilePicture from './ProfilePicture';
import { stateEmojis, stateValue } from '../utils/objects';

const experienceLevelEmoji = {
  Beginner: '🟢',
  Intermediate: '🟦',
  Advanced: '♦',
};
const state = ['open', 'done', 'cancelled', 'expired'];

export default function BountyDetails() {
  const params = useParams();
  const [bounty, setBounty] = useState(null);
  const bountyId = params.bountyId;
  const { walletAddress } = useProfile();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bountyId}/`)
      .then((res) => setBounty(res.data))
      .catch((err) => console.log('😢 ' + err));
  }, [bountyId]);

  if (bounty == null) {
    return null;
  }

  const handleStateChange = async (e) => {
    setBounty({ ...bounty, state: e.target.value });
    // Don't need to add activity for this change
    await axios
      .patch(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bountyId}/`, {
        bounty: { state: e.target.value },
      })
      .then((res) => console.log('✅ status changed', res))
      .catch((err) => console.log(err));
  };
  return (
    <Container>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Box display='flex'>
          <ProfilePicture profileAddress={bounty.bounty_creator} />
          <Box marginLeft={2}>
            <Box display='flex' textAlign='center'>
              <Typography variant='h6' marginBottom={2} color='main'>
                {bounty.title}
              </Typography>
              {walletAddress === bounty.bounty_creator ? (
                <Link to={`/bounty/${bountyId}/edit/`}>
                  <EditIcon
                    sx={{
                      color: 'rgb(251,28,72, 0.6)',
                      marginLeft: 4,
                      cursor: 'pointer',
                      marginTop: 0.5,
                    }}
                  />
                </Link>
              ) : null}
            </Box>
            <BountyCategories categories={bounty.bounty_category} />
          </Box>
        </Box>
        <Box>
          <Box display='flex'>
            <Typography
              color='#D940FF'
              height={25}
              paddingLeft={2}
              paddingRight={2}
              backgroundColor='rgb(144,44,204, 0.4)'
            >
              {bounty.bounty_value_in_usd} USD
            </Typography>
            <Typography
              marginLeft={1}
              color='#FF367F'
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
          <BountyStatus bounty={bounty} handleStateChange={handleStateChange} />
          <ExperienceLevel experienceLevel={bounty.experience_level} />
          <TimeCommitment timeCommitment={bounty.project_length} />
          {/* <WhenCreated timeLapse={bounty.updated_at} /> */}
        </Box>
      </Box>
      <ButtonActionsLogic bounty={bounty} setBounty={setBounty} />
      <Divider sx={{ marginTop: 3, marginBottom: 3 }} />
      <Typography variant='h6' fontWeight='500' color='main'>
        Description
      </Typography>
      <MDEditor.Markdown
        style={{
          padding: 15,
          backgroundColor: BACKGROUND_COLOR,
          color: '#edf2f4',
        }}
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
      <Link to={`/profile/${bountyAddress}`} style={{ textDecoration: 'none' }}>
        <Button sx={{ padding: 0, fontSize: 16, color: '#649ddf' }}>
          {' '}
          {walletAddressShortener(bountyAddress)}
        </Button>
      </Link>
    </Box>
  );
}

function CreatorContactInfo({ contactInfo }) {
  return (
    <Box marginRight={2}>
      <Typography color='#757575' fontWeight='600'>
        Point of Contact
      </Typography>
      <Typography fontWeight='600' color='main'>
        ✉️ {contactInfo}
      </Typography>
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
          <React.Fragment key={w.id}>
            <Link
              to={`/profile/${bountyOwnersWallets}`}
              style={{ textDecoration: 'none' }}
            >
              <Button sx={{ padding: 0, fontSize: 16, color: '#649ddf' }}>
                {walletAddressShortener(w)}
              </Button>
            </Link>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

function BountyStatus({ bounty, handleStateChange }) {
  // Going to allow bounty owner to change the status of the bounty
  const { walletAddress } = useProfile();
  return (
    <Box marginRight={2}>
      <Typography color='#757575' fontWeight='600'>
        Status
      </Typography>
      {walletAddress === bounty.bounty_creator ? (
        <Select
          value={bounty.state}
          onChange={handleStateChange}
          sx={{ backgroundColor: 'main', borderRadius: 0 }}
        >
          {state.map((option) => (
            <MenuItem value={option} key={option}>
              {stateEmojis[option] + ' ' + stateValue[option]}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <Typography color='main' fontWeight='600'>
          {stateEmojis[bounty.state] + ' ' + stateValue[bounty.state]}
        </Typography>
      )}
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
      <Typography color='main' fontWeight='600'>
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
      <Typography fontWeight='600' color='main'>
        ⏱ {timeCommitment}
      </Typography>
    </Box>
  );
}

function WhenCreated({ timeLapse }) {
  return (
    <Box>
      <Typography color='#757575' fontWeight='600'>
        Creation Date
      </Typography>
      <Typography fontWeight='600' color='main'>
        🗓 {timeFromUpdateUtil(timeLapse)}
      </Typography>
    </Box>
  );
}

// const

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
            '&:hover': {
              backgroundColor: 'rgb(29,179,249)',
            },
            backgroundColor: 'rgb(29,179,249, 0.7)',
            color: 'main',
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
        <Link
          to={`/bounty/${bounty.id}/submit/`}
          style={{ textDecoration: 'none' }}
        >
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
        </Link>
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
  if (bounty.state === 'open') {
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
            '&:hover': {
              backgroundColor: 'rgb(29,179,249)',
            },
            backgroundColor: 'rgb(29,179,249, 0.7)',
            color: 'main',
          }}
        >
          Start Project
        </Button>
      </>
    );
  }
}

function FilesAndImages({ imageAttachments }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Typography
        variant='h6'
        fontWeight='500'
        sx={{ marginTop: 8, marginBottom: 3 }}
        color='main'
      >
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
  }, [bountyId]);
  if (activities == null) {
    return null;
  }
  return (
    <>
      <Divider
        sx={{ marginTop: 3, marginBottom: 3, backgroundColor: 'main' }}
      />
      <Typography
        variant='h6'
        fontWeight='500'
        sx={{ marginBottom: 5 }}
        color='main'
      >
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
