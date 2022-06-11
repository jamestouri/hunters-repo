import {
  Box,
  Drawer,
  Divider,
  Typography,
  Checkbox,
  TextField,
} from '@mui/material';
import { useReducer, useState } from 'react';
import sideNavReducer from '../reducers/sideNavReducer';

const initialFilterState = {
  timeCommitment: [],
  experienceLevel: [],
  statusBar: [],
  daos: [],
};

export default function SideNav() {
  const [searchValue, setSearchValue] = useState('');
  const [state, dispatch] = useReducer(sideNavReducer, initialFilterState);
  console.log(searchValue);
  return (
    <Drawer
      variant='permanent'
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        overflow: 'scroll',
      }}
      open
    >
      <Box marginLeft={2}>
        <Typography variant='body1' sx={{ fontWeight: '600' }}>
          Time Commitment
        </Typography>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'hours' })}
            sx={{ padding: 0 }}
            value='hours'
          />{' '}
          <Typography>Hours</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'days' })}
            sx={{ padding: 0 }}
            value='days'
          />{' '}
          <Typography>Days</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'weeks' })}
            sx={{ padding: 0 }}
            value='weeks'
          />{' '}
          <Typography>Weeks</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'months' })}
            sx={{ padding: 0 }}
            value='months'
          />{' '}
          <Typography>Months</Typography>
        </Box>
        <Divider variant='middle' sx={{ marginTop: 3, marginLeft: 0 }} />
        <TextField
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          variant='outlined'
          label='DAO Search'
          sx={{ marginTop: 3, marginLeft: 1, marginRight: 3 }}
        />
        <Divider
          variant='middle'
          sx={{ marginBottom: 3, marginLeft: 0, marginTop: 3 }}
        />

        <Typography sx={{ fontWeight: '600' }}>Experience Level</Typography>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'beginner' })}
            sx={{ padding: 0 }}
            value='beginner'
          />{' '}
          <Typography>Beginner</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'intermediate' })}
            sx={{ padding: 0 }}
            value='intermediate'
          />{' '}
          <Typography>Intermediate</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'advanced' })}
            sx={{ padding: 0 }}
            value='advanced'
          />{' '}
          <Typography>Advanced</Typography>
        </Box>
        <Divider
          variant='middle'
          sx={{ marginBottom: 3, marginLeft: 0, marginTop: 3 }}
        />

        <Typography sx={{ fontWeight: '600' }}>Status</Typography>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'open' })}
            sx={{ padding: 0 }}
            value='open'
          />{' '}
          <Typography>Open</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'bountyAssigned' })}
            sx={{ padding: 0 }}
            value='bountyAssigned'
          />{' '}
          <Typography>Bounty Assigned</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'workSubmitted' })}
            sx={{ padding: 0 }}
            value='workSubmitted'
          />{' '}
          <Typography>Work Submitted</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'done' })}
            sx={{ padding: 0 }}
            value='done'
          />{' '}
          <Typography>Done</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'expired' })}
            sx={{ padding: 0 }}
            value='expired'
          />{' '}
          <Typography>Expired</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Checkbox
            onClick={() => dispatch({ type: 'cancelled' })}
            sx={{ padding: 0 }}
            value='cancelled'
          />{' '}
          <Typography>Cancelled</Typography>
        </Box>
      </Box>
    </Drawer>
  );
}
