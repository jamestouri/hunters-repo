import {
  Box,
  Drawer,
  Divider,
  Typography,
  Checkbox,
  TextField,
} from '@mui/material';
import { useState } from 'react';

export default function SideNav({ dispatch }) {
  const [searchValue, setSearchValue] = useState('');

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
        <NavCell type='Hours' text='Hours' dispatch={dispatch} />
        <NavCell type='Days' text='Days' dispatch={dispatch} />
        <NavCell type='Weeks' text='Weeks' dispatch={dispatch} />
        <NavCell type='Months' text='Months' dispatch={dispatch} />
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
        <NavCell type='Beginner' text='Beginner' dispatch={dispatch} />
        <NavCell type='Intermediate' text='Intermediate' dispatch={dispatch} />
        <NavCell type='Advanced' text='Advanced' dispatch={dispatch} />
        <Divider
          variant='middle'
          sx={{ marginBottom: 3, marginLeft: 0, marginTop: 3 }}
        />
        <Typography sx={{ fontWeight: '600' }} marginBottom={2}>
          Status
        </Typography>
        <NavCell type='open' text='✅ Open' dispatch={dispatch} />
        <NavCell type='done' text='⌛️ Done' dispatch={dispatch} />
        <NavCell type='expired' text='🔒 Expired' dispatch={dispatch} />
        <NavCell type='cancelled' text='❌ Cancelled' dispatch={dispatch} />
      </Box>
    </Drawer>
  );
}

function NavCell({ type, text, dispatch }) {
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
