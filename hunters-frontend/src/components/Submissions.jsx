import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import axios from 'axios';
import { Box, Button, Typography } from '@mui/material';
import ProfileNameFromId from './ProfileNameFromId';
import { timeCreatedForActivity } from '../utils/helpers';
import ProfilePicture from './ProfilePicture';
import MDEditor from '@uiw/react-md-editor';
import { BACKGROUND_COLOR } from '../utils/constants';

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
  const { walletAddress } = useProfile();

  const [bounty, setBounty] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/bounty/${submission.bounty}/`
      )
      .then((res) => setBounty(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (bounty == null) {
    return null;
  }

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
          <ProfilePicture profileAddress={submission.profile} dimension={60} />
          <Box>
            <Typography variant='body2' color='subColor' fontWeight='600'>
              Account
            </Typography>
            <ProfileNameFromId profileId={submission.profile} />
          </Box>
        </Box>
        <Box>
          <Typography
            variant='body2'
            color='subColor'
            fontWeight='600'
            paddingBottom={0.2}
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
          <Typography variant='body2' color='subColor' fontWeight='600'>
            Submitted
          </Typography>
          <Typography
            sx={{ paddingTop: 1 }}
            variant='body2'
            fontWeight='600'
            color='main'
          >
            {timeCreatedForActivity(submission.created_at)}
          </Typography>
        </Box>
        {bounty.bounty_creator === walletAddress ? (
          <Box>
            <Typography color='subColor' variant='body2' fontWeight='600'>
              Submitter's Email
            </Typography>
            <Typography
              sx={{ paddingTop: 1 }}
              variant='body2'
              fontWeight='600'
              color='main'
            >
              {submission.email}
            </Typography>
          </Box>
        ) : null}
        <Box />
      </Box>
      <Typography marginLeft={9} variant='h6' marginBottom={3} color='main'>
        {submission.submission_header}
      </Typography>
      <MDEditor.Markdown
        style={{
          padding: 15,
          backgroundColor: BACKGROUND_COLOR,
          color: '#edf2f4',
        }}
        source={bounty.description}
        linkTarget='_blank'
      />
      {bounty.bounty_creator === walletAddress ? (
        <SubmissionActionButtons submission={submission} />
      ) : null}
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
    <Box marginTop={3}>
      {open ? (
        <Box display='flex' justifyContent='space-evenly'>
          <Button variant='contained' sx={{ borderRadius: 0 }}>
            Accept and Pay Out
          </Button>
          <Button onClick={handleArchiving}>Archive</Button>
        </Box>
      ) : (
        <Button onClick={handleReopening}>Reopen</Button>
      )}
    </Box>
  );
}
