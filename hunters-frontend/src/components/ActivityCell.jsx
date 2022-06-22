import { Box, Typography } from '@mui/material';
import {
  timeCreatedForActivity,
} from '../utils/helpers';
import ProfileNameFromId from './ProfileNameFromId';
import ProfilePicture from './ProfilePicture';

export function ActivityCell({ activity }) {
  return (
    <Box
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      marginTop={3}
    >
      <Box display='flex'>
        <ProfilePicture profileAddress={activity.profile} dimension={60} />
        <ProfileNameFromId profileId={activity.profile} />
      </Box>
      <Typography color='main'>{activity.activity_type}</Typography>
      <Typography variant='body2' color='subColor' fontWeight='600'>
        {timeCreatedForActivity(activity.created_at)}
      </Typography>
      <Box />
    </Box>
  );
}
