import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Container } from '@mui/system';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';

export default function ProjectSubmission() {
  const params = useParams();
  const { walletAddress } = useProfile();
  const bountyId = params.bountyId;
  const navigate = useNavigate();
  const [additionalText, setAdditionalText] = useState('');

  const { register, handleSubmit } = useForm();

  const submitProject = async (formData) => {
    const data = {
      ...formData,
      wallet_address: walletAddress,
      bounty: bountyId,
      additional_text: additionalText,
    };
    const activity = { bounty: bountyId, activity_type: 'Work Submitted' };
    await axios
      .post(`${process.env.REACT_APP_DEV_SERVER}/api/work_submissions/`, {
        work_submission: data,
        activities: activity,
      })
      .then((res) => {
        console.log('✅ everything worked', res);
        navigate(`/bounty/${bountyId}`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <FormControl>
        <Box>
          <Typography fontWeight='600' color='main'>Subject Line</Typography>
          <TextField
            {...register('submission_header')}
            required
            variant='standard'
            placeholder='The Greatest Project Submission Ever!'
          />
        </Box>
        <Box marginTop={2}>
          <Typography fontWeight='600' color='main'>Project Link</Typography>
          <TextField
            {...register('project_link')}
            required
            variant='outlined'
            placeholder='myawesomesubmission.com'
          />
        </Box>
        <Box marginTop={2}>
          <Typography color='main' fontWeight='600'>Email</Typography>
          <Typography variant='body2' fontWeight='600' color='#757575'>
            *Only the Bounty Creator will see it
          </Typography>
          <TextField
            {...register('email')}
            required
            variant='outlined'
            placeholder='something@hunters.com'
          />
        </Box>
      </FormControl>
      <Box marginTop={2}>
        <Typography>Additional Description of Submission</Typography>

        <MDEditor
          style={{ marginTop: 20 }}
          height={500}
          value={additionalText}
          onChange={setAdditionalText}
        />
      </Box>

      <Button onClick={handleSubmit((formData) => submitProject(formData))}>
        Submit
      </Button>
    </Container>
  );
}
