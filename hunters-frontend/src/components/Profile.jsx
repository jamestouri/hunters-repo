import { Container, Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { walletAddressShortener } from '../utils/helpers';
import axios from 'axios';
import { CardMedia, Typography } from '@mui/material';
import BountyCell from './BountyCell';

export default function Profile() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
  const [createdBounties, setCreatedBounties] = useState([]);
  const [ownedBounties, setOwnedBounties] = useState([]);

  const walletFromParam = params.walletAddress;
  // Checking if this is the user's profile or not
  const { walletAddress } = useProfile();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/profile/${walletFromParam}/`
      )
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  }, [walletFromParam]);

  // TODO put this request when retrieving Profile Object
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/bounties?bounty_creator=${walletFromParam}`
      )
      .then((res) => setCreatedBounties(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/bounties?bounty_owner=${walletFromParam}`
      )
      .then((res) => setOwnedBounties(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (profile == null) {
    return null;
  }
  return (
    <Container>
      <Box display='flex' flexDirection='column' justifyContent='center'>
        <ProfilePic profile={profile} />
        <Typography marginTop={3} fontWeight='600' marginLeft={1}>
          {walletAddressShortener(profile.wallet_address)}
        </Typography>
      </Box>
      <Typography marginTop={10} variant='h5'>
        Bounties Created
      </Typography>
      {createdBounties.map((created) => (
        <BountyCell key={created.id} bounty={created} />
      ))}
      <Typography marginTop={10} variant='h5'>
        Bounties Working On
      </Typography>
      {ownedBounties.map((owned) => (
        <BountyCell key={owned.id} bounty={owned} />
      ))}
    </Container>
  );
}

function ProfilePic({ profile }) {
  const [profilePic, setProfilePic] = useState(profile.profile_picture);

  console.log(profilePic);

  return profilePic ? (
    <CardMedia
      component='img'
      sx={{
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 5,
        cursor: 'pointer',
      }}
      image={profilePic}
    >
      {' '}
      <input
        alt='image in here'
        type='file'
        name='image'
        hidden
        multiple
        // onChange={(e) => setFiles(e.target.files)}
      />
    </CardMedia>
  ) : (
    <Box height={120} width={120} borderRadius={60} backgroundColor='#1DB3F9'>
      {' '}
      <input
        alt='image in here'
        type='file'
        name='image'
        hidden
        multiple
        // onChange={(e) => setFiles(e.target.files)}
      />
    </Box>
  );
}
