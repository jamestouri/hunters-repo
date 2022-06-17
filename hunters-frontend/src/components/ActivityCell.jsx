import { Box, Typography } from '@mui/material';
import {
  timeCreatedForActivity,
} from '../utils/helpers';
import ProfileNameFromId from './ProfileNameFromId';

export function ActivityCell({ activity }) {
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      marginTop={3}
    >
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
      <Typography>{activity.activity_type}</Typography>
      <Typography variant='body2' color='#757575' fontWeight='600'>
        {timeCreatedForActivity(activity.created_at)}
      </Typography>
      <Box />
    </Box>
  );
}
