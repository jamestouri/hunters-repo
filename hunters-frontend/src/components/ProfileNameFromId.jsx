import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { walletAddressShortener } from '../utils/helpers';

export default function ProfileNameFromId({ profileId }) {
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
