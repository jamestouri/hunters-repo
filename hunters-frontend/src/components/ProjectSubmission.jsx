import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Container } from '@mui/system';
import axios from 'axios';

export default function ProjectSubmission() {
  const params = useParams();
  const { walletAddress } = useProfile();
  const bountyId = params.bountyId;
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const submitProject = async (formData) => {
    const data = { ...formData, wallet_address: walletAddress, bounty: bountyId };
    const activity = { bounty: bountyId, activity_type: 'Work Submitted' };
    await axios
      .post(`${process.env.REACT_APP_DEV_SERVER}/api/work_submissions/`, {
        work_submission: data,
        activities: activity,
      })
      .then((res) => {
          console.log('✅ everything worked', res)
          navigate(`/bounty/${bountyId}`)
        })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <FormControl>
        <Box>
          <Typography>Subject Line</Typography>
          <TextField
            {...register('submission_header')}
            required
            variant='standard'
            placeholder='The Greatest Project Submission Ever!'
          />
        </Box>
        <Box marginTop={2}>
          <Typography>Project Link</Typography>
          <TextField
            {...register('project_link')}
            required
            variant='outlined'
            placeholder='myawesomesubmission.com'
          />
        </Box>
        <Box marginTop={2}>
          <Typography>Additional Description of Submission</Typography>
          <TextField
            {...register('additional_text')}
            required
            variant='outlined'
            multiline
            rows={10}
          />
        </Box>
        <Box marginTop={2}>
          <Typography>email</Typography>
          <TextField
            {...register('email')}
            required
            variant='outlined'
            placeholder='something@hunters.com'
          />
        </Box>
        <Button onClick={handleSubmit((formData) => submitProject(formData))}>
          Submit
        </Button>
      </FormControl>
    </Container>
  );
}
