import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import ProfileNameFromId from './ProfileNameFromId';
import { timeCreatedForActivity } from '../utils/helpers';

// TODO Find a way to make this authenticated so only the person with the wallet
// address can go on this page
export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [openSubmissions, setOpenSubmissions] = useState(true);

  const params = useParams();
  const bountyId = params.bountyId;

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/work_submissions?bounty_id=${bountyId}&open=${openSubmissions}`
      )
      .then((res) => setSubmissions(res.data))
      .catch((err) => console.log(err));
  }, [openSubmissions, bountyId]);

  if (submissions == null) {
    return null;
  }
  console.log('submissions', submissions);
  return (
    <Box>
      <OpenAndArchivedButtons
        openButton={openSubmissions}
        setOpenButton={setOpenSubmissions}
      />
      {submissions.map((s) => (
        <SubmissionCell key={s.id} submission={s} />
      ))}
    </Box>
  );
}

function OpenAndArchivedButtons({ openButton, setOpenButton }) {
  return (
    <Box display='flex' justifyContent='space-around' marginBottom={5}>
      <Button
        sx={{
          boxShadow: 'none',
          borderRadius: 0,
          color: openButton === true ? '#1db3f9' : '#757575',
          borderColor: '#1db3f9',
          fontWeight: openButton === true ? '600' : '500',
          fontSize: 16,
        }}
        variant={openButton === true ? 'outlined' : 'standard'}
        onClick={openButton === null ? () => setOpenButton(true) : null}
      >
        Submissions Open
      </Button>
      <Button
        sx={{
          boxShadow: 'none',
          borderRadius: 0,
          color: openButton === null ? '#1db3f9' : '#757575',
          borderColor: '#1db3f9',
          fontWeight: openButton === null ? '600' : '500',
          fontSize: 16,
        }}
        variant={openButton === null ? 'outlined' : 'standard'}
        onClick={openButton === true ? () => setOpenButton(null) : null}
      >
        Archived
      </Button>
    </Box>
  );
}

function SubmissionCell({ submission }) {
  return (
    <Box
      sx={{
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'rgb(22,22,22, 0.2)',
      }}
      marginLeft={6}
      marginRight={6}
      paddingLeft={3}
      paddingRight={3}
      marginBottom={10}
      paddingBottom={3}
    >
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
          <Box>
            <Typography variant='body2' color='#757575' fontWeight='600'>
              Account
            </Typography>
            <ProfileNameFromId profileId={submission.profile} />
          </Box>
        </Box>
        <Box>
          <Typography
            variant='body2'
            color='#757575'
            fontWeight='600'
            paddingBottom={0.5}
          >
            Project Link
          </Typography>
          <Button
            sx={{ fontSize: 16, padding: 0 }}
            href={`http://${submission.project_link}`}
          >
            {submission.project_link}
          </Button>
        </Box>
        <Box>
          <Typography variant='body2' color='#757575' fontWeight='600'>
            Submitted
          </Typography>
          <Typography sx={{ padding: 1 }} variant='body2' fontWeight='600'>
            {timeCreatedForActivity(submission.created_at)}
          </Typography>
        </Box>
        <Box>
          <Typography color='#757575' variant='body2' fontWeight='600'>
            Submitter's Email (Only the Bounty Creator will see this)
          </Typography>
          <Typography sx={{ padding: 1 }} variant='body2' fontWeight='600'>
            {submission.email}
          </Typography>
        </Box>
        <Box />
      </Box>
      <Typography marginLeft={9} variant='h6' marginBottom={3}>
        {submission.submission_header}
      </Typography>
      <Typography marginLeft={9}>{submission.additional_text}</Typography>
      <SubmissionActionButtons submission={submission} />
    </Box>
  );
}

function SubmissionActionButtons({ submission }) {
  const [open, setOpen] = useState(submission.open);
  const handleArchiving = async () => {
    axios
      .patch(
        `${process.env.REACT_APP_DEV_SERVER}/api/work_submission/${submission.id}/`,
        {
          work_submission: { open: false },
        }
      )
      .then(() => setOpen(false));
  };

  const handleReopening = async () => {
    axios
      .patch(
        `${process.env.REACT_APP_DEV_SERVER}/api/work_submission/${submission.id}/`,
        {
          work_submission: { open: true },
        }
      )
      .then(() => setOpen(true));
  };

  return (
    <Box display='flex' justifyContent='flex-end'>
      {open ? (
        <Box>
          <Button>Accept and Pay Out</Button>
          <Button onClick={handleArchiving}>Archive</Button>
        </Box>
      ) : (
        <Button onClick={handleReopening}>Reopen</Button>
      )}
    </Box>
  );
}
