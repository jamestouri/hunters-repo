import { CardMedia, Box, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { timeFromUpdateUtil } from '../utils/helpers';
import axios from 'axios';

const stateEmojis = {
  cancelled: '❌',
  open: '✅',
  done: '⌛️',
  expired: '🔒',
};

const stateValue = {
  open: 'Open Bounty',
  done: 'Done',
  cancelled: 'Cancelled',
  expired: 'Expired',
};

export default function BountyCell({ bounty }) {
  const {
    id,
    title,
    funding_organization,
    state,
    bounty_value_in_usd,
    bounty_value_in_eth,
    bounty_creator,
    updated_at,
    project_length,
  } = bounty;

  return (
    <Link to={`/bounty/${id}/`} style={{ textDecoration: 'none' }}>
      <Box marginTop={5}>
        <Card variant='outlined' sx={{ borderRadius: 0 }}>
          <CardContent
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <Box display='flex'>
              <Box display='flex' alignItems='center'>
                <ProfileLayout bountyCreator={bounty_creator} />
                <Box marginLeft={2}>
                  <Typography
                    variant='body1'
                    sx={{ fontWeight: '600' }}
                    color='black'
                  >
                    {title}
                  </Typography>
                  <Typography
                    marginTop={1}
                    variant='body2'
                    fontWeight='600'
                    color={'#5951F6'}
                  >
                    {funding_organization}
                  </Typography>
                  <Box display='flex' marginTop={1}>
                    <Typography variant='body2' color='#757575' marginRight={2}>
                      {stateEmojis[state] + ' ' + stateValue[state]}
                    </Typography>
                    <Typography color='#757575' marginRight={2}>
                      ·
                    </Typography>
                    <Typography variant='body2' color='#757575' marginRight={2}>
                      {timeFromUpdateUtil(updated_at)}
                    </Typography>
                    <Typography color='#757575' marginRight={2}>
                      ·
                    </Typography>
                    <Typography variant='body2' color='#757575' marginRight={2}>
                      12 comments
                    </Typography>
                    <Typography color='#757575' marginRight={2}>
                      ·
                    </Typography>
                    <Box display='flex'>
                      <Typography variant='body2' color='#757575'>
                        Expected{' '}
                      </Typography>
                      <Typography
                        marginLeft={0.5}
                        marginRight={0.5}
                        variant='body2'
                        color='#757575'
                        fontWeight='600'
                      >
                        {project_length}
                      </Typography>{' '}
                      <Typography variant='body2' color='#757575'>
                        to complete
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box display='flex'>
              <Typography
                color='#9f29bc'
                height={25}
                paddingLeft={2}
                paddingRight={2}
                backgroundColor={'rgb(144,44,204, 0.3)'}
              >
                {bounty_value_in_usd} USD
              </Typography>
              <Typography
                marginLeft={3}
                color='#e41f66'
                height={25}
                paddingLeft={2}
                paddingRight={2}
                backgroundColor={'rgb(228,31,102, 0.3)'}
              >
                {parseFloat(bounty_value_in_eth).toFixed(2)} ETH
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Link>
  );
}

function ProfileLayout({ bountyCreator }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DEV_SERVER}/api/profile/${bountyCreator}/`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (profile == null) {
    return (
      <Box
        sx={{
          height: 80,
          width: 80,
          borderRadius: 40,
          backgroundColor: '#1DB3F9',
        }}
      />
    );
  }

  return profile.profile_picture ? (
    <CardMedia
      component='img'
      sx={{
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 5,
        cursor: 'pointer',
      }}
      image={profile.profile_picture}
    />
  ) : (
    <Box
      sx={{
        height: 80,
        width: 80,
        borderRadius: 40,
        backgroundColor: profile.profile_picture_initial,
      }}
    />
  );
}
