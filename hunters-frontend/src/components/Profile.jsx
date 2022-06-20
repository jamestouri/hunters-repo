import { Container, Box } from '@mui/system';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { walletAddressShortener } from '../utils/helpers';
import axios from 'axios';
import { CardMedia, Typography } from '@mui/material';

export default function Profile() {
  const params = useParams();
  const [profile, setProfile] = useState(null);
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
  }, []);

  // TODO put this request when retrieving Profile Object
  useEffect(() => {
    axios
    .get(
      `${process.env.REACT_APP_DEV_SERVER}/api/bounties/${walletFromParam}/`
    )
    .then((res) => setOwnedBounties(res.data))
    .catch((err) => console.log(err));
  }, [])

  console.log(ownedBounties);

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
    />
  ) : (
    <Box height={120} width={120} borderRadius={60} backgroundColor='#1DB3F9' />
  );
}
