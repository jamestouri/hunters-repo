import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { Button, FormControl, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Container } from '@mui/system';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';

const textField = {
  backgroundColor: 'main',
  padding: 0.1,
  borderRadius: 0,
  marginTop: 2,
};

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
      <Typography color='primary' variant='h4'>
        Submit Work
      </Typography>
      <FormControl style={{ width: '50%' }}>
        <Typography fontWeight='600' color='main' marginTop={3}>
          Subject Line
        </Typography>
        <TextField
          {...register('submission_header')}
          required
          variant='outlined'
          placeholder='The Greatest Project Submission Ever!'
          inputProps={{ maxLength: 80 }}
          sx={textField}
        />

        <Typography fontWeight='600' color='main' marginTop={3}>
          Project Link
        </Typography>
        <TextField
          {...register('project_link')}
          required
          variant='outlined'
          placeholder='myawesomesubmission.com'
          sx={textField}
        />

        <Typography color='main' fontWeight='600' marginTop={3}>
          Email
        </Typography>
        <Typography variant='body2' fontWeight='600' color='#757575'>
          *Only the Bounty Creator will see this
        </Typography>
        <TextField
          {...register('email')}
          required
          variant='outlined'
          placeholder='something@hunters.com'
          sx={textField}
        />
      </FormControl>

      <Typography fontWeight='600' color='main' marginTop={3}>
        Additional Description of Submission
      </Typography>

      <MDEditor
        style={{ marginTop: 20 }}
        height={500}
        value={additionalText}
        onChange={setAdditionalText}
      />

      <Button
        sx={{
          width: '25%',
          marginTop: 4,
          marginBottom: 10,
          borderWidth: 1,
          borderColor: '#1db3f9',
          borderRadius: 0,
          color: '#1db3f9'
        }}
        variant='outlined'
        onClick={handleSubmit((formData) => submitProject(formData))}
      >
        Submit
      </Button>
    </Container>
  );
}
