import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import {
  walletAddressShortener,
  timeCreatedForActivity,
} from '../utils/helpers';

export function ActivityCell({ activity }) {
  return (
    <Box display='flex' key={activity.id} alignItems='center' marginTop={3}>
      <Box display='flex'>
        <Box
          height={60}
          width={60}
          borderRadius={30}
          marginRight={2}
          backgroundColor='#1db3f9'
        />
        <ProfileNameFromId profileId={activity.profile} />
      </Box>
      <Typography sx={{marginLeft: '15%'}} >{activity.activity_type}</Typography>
      <Typography sx={{marginLeft: '15%'}} variant='body2' color='#757575' fontWeight='600'>
        {timeCreatedForActivity(activity.created_at)}
      </Typography>
    </Box>
  );
}

function ProfileNameFromId({ profileId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DEV_SERVER}/api/profile/${profileId}/`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (profile == null) {
    return null;
  }

  return (
    <Button sx={{ fontSize: 16, padding: 0 }}>
      {walletAddressShortener(profile.wallet_address)}
    </Button>
  );
}
