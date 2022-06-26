import { useEffect, useState } from 'react';
import axios from 'axios';
import { CardMedia, Box } from '@mui/material';

export default function ProfilePicture({ profileAddress, dimension = 80 }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DEV_SERVER}/api/profile/${profileAddress}/`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  }, [profileAddress]);

  if (profile == null) {
    return (
      <Box
        sx={{
          height: dimension,
          width: dimension,
          borderRadius: dimension / 2,
          backgroundColor: '#1DB3F9',
        }}
      />
    );
  }

  return profile.profile_picture ? (
    <CardMedia
      component='img'
      sx={{
        width: dimension,
        height: dimension,
        borderRadius: dimension / 2,
        marginRight: 3,
        cursor: 'pointer',
      }}
      image={profile.profile_picture}
    />
  ) : (
    <Box
      sx={{
        marginRight: 3,
        height: dimension,
        width: dimension,
        borderRadius: dimension / 2,
        backgroundColor: profile.profile_picture_initial,
      }}
    />
  );
}
