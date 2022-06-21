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
      <Box marginLeft={2} marginTop={10}>
        <Typography variant='body1' sx={{ fontWeight: '600' }} marginBottom={2}>
          Time Commitment
        </Typography>
        <NavCell type='hours' text='Hours' />
        <NavCell type='days' text='Days' />
        <NavCell type='weeks' text='Weeks' />
        <NavCell type='months' text='Months' />
        <Divider variant='middle' sx={{ marginTop: 3, marginLeft: 0 }} />
        <TextField
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          variant='outlined'
          label='DAO Search'
          sx={{ marginTop: 3, marginLeft: 1, marginRight: 3, borderRadius: 0 }}
        />
        <Divider
          variant='middle'
          sx={{ marginBottom: 3, marginLeft: 0, marginTop: 3 }}
        />
        <Typography sx={{ fontWeight: '600' }} marginBottom={2}>
          Experience Level
        </Typography>
        <NavCell type='beginner' text='Beginner' />
        <NavCell type='intermediate' text='Intermediate' />
        <NavCell type='advanced' text='Advanced' />
        <Divider
          variant='middle'
          sx={{ marginBottom: 3, marginLeft: 0, marginTop: 3 }}
        />
        <Typography sx={{ fontWeight: '600' }} marginBottom={2}>
          Status
        </Typography>
        <NavCell type='open' text='✅ Open' />
        <NavCell type='done' text='⌛️ Done' />
        <NavCell type='expired' text='🔒 Expired' />
        <NavCell type='cancelled' text='❌ Cancelled' />
      </Box>
    </Drawer>
  );
}

function NavCell({ type, text }) {
  const [state, dispatch] = useReducer(sideNavReducer, initialFilterState);

  return (
    <Box display='flex' alignItems='center' marginBottom={1}>
      <Checkbox
        onClick={() => dispatch({ type: type })}
        sx={{ padding: 0 }}
        value={type}
      />{' '}
      <Typography>{text}</Typography>
    </Box>
  );
}
