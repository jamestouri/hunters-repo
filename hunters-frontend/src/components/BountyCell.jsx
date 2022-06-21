import { Box, Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import useWindowSize from '../contexts/WindowSize';
import { BACKGROUND_COLOR } from '../utils/constants';

import { timeFromUpdateUtil } from '../utils/helpers';
import ProfilePicture from './ProfilePicture';

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
  const size = useWindowSize();
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
    <Card variant='outlined' sx={{ borderRadius: 0, marginTop: 5, borderWidth: 1, borderColor: '#e41f66', backgroundColor: BACKGROUND_COLOR }}>
      <Link to={`/bounty/${id}/`} style={{ textDecoration: 'none' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display='flex'>
            <Box display='flex' alignItems='center'>
              <ProfilePicture profileAddress={bounty_creator} />
              <Box marginLeft={2}>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: '600' }}
                  color='main'
                >
                  {title}
                </Typography>
                <Typography
                  marginTop={1}
                  variant='body2'
                  fontWeight='500'
                  color='main'
                >
                  {funding_organization}
                </Typography>
                {size.width > 500 ? (
                  <Box display='flex' marginTop={1}>
                    <Typography
                      variant='body2'
                      color='subColor'
                      marginRight={2}
                      sx={{
                        textOverflow: 'ellipses',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {stateEmojis[state] + ' ' + stateValue[state]}
                    </Typography>
                    <Typography color='subColor' marginRight={2}>
                      ·
                    </Typography>
                    <Typography
                      variant='body2'
                      color='subColor'
                      marginRight={2}
                      sx={{
                        textOverflow: 'ellipses',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {timeFromUpdateUtil(updated_at)}
                    </Typography>
                    <Typography color='subColor' marginRight={2}>
                      ·
                    </Typography>
                    <Typography
                      variant='body2'
                      color='subColor'
                      marginRight={2}
                      sx={{
                        textOverflow: 'ellipses',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      12 comments
                    </Typography>
                    <Typography color='subColor' marginRight={2}>
                      ·
                    </Typography>
                    <Box
                      display='flex'
                      sx={{
                        textOverflow: 'ellipses',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Typography variant='body2' color='subColor'>
                        Expected{' '}
                      </Typography>
                      <Typography
                        marginLeft={0.5}
                        marginRight={0.5}
                        variant='body2'
                        color='subColor'
                        fontWeight='600'
                      >
                        {project_length}
                      </Typography>{' '}
                      <Typography variant='body2' color='subColor'>
                        to complete
                      </Typography>
                    </Box>
                  </Box>
                ) : null}
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
      </Link>
    </Card>
  );
}
