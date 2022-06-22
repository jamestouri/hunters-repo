import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import { useProfile } from '../contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';

import {
  Button,
  Box,
  FormControl,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Select,
} from '@mui/material';
import { storeFilesInIPFS } from '../utils/helpers';
import { Container } from '@mui/system';

const bountyTypes = [
  'Bug',
  'Project',
  'Feature',
  'Security',
  'Improvement',
  'Design',
  'Docs',
  'Code review',
  'Other',
];

const bountyCategories = [
  'frontend',
  'backend',
  'design',
  'documentation',
  'other',
  'react',
  'solidity',
  'javascript',
];

const projectLength = ['Hours', 'Days', 'Weeks', 'Months'];

function showFilePaths(files) {
  const fileArr = Array.from(files);
  return (
    <>
      {fileArr.map((f) => (
        <Typography color='main'>{f.name}</Typography>
      ))}
    </>
  );
}

export default function NewBounty() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  // markdown doesn't work with useForm
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { formState, register, handleSubmit, watch } = useForm();
  const { walletAddress } = useProfile();

  //  Bounty creator added with wallet address
  const { errors } = formState;

  const saveBounty = async (formData) => {
    setLoading(true);
    console.log('loading started');
    let data = { ...formData, bounty_creator: walletAddress };
    // Currency converter depending on which they use:
    // This is temporary and eventually will update the price change in real time
    data = { ...data, bounty_value_in_usd: 1200 * data.bounty_value_in_eth };

    // Image files
    const attachedFiles = await storeFilesInIPFS(files);
    data = {
      ...data,
      image_attachments: attachedFiles,
      description: description,
    };

    await axios
      .post(`${process.env.REACT_APP_DEV_SERVER}/api/bounties/`, {
        bounty: data,
      })
      .then((res) => {
        console.log('✅ bounty created', res);
        navigate(`/bounty/${res.data.id}/`);
      })
      .catch((err) => console.log(err));
    setLoading(false);
    console.log('loading ended');
  };

  if (walletAddress == null) {
    return <WalletNotConnectedText />;
  }

  return (
    <Container>
      <Typography color='primary' variant='h4'>
        Create Bounty
      </Typography>
      <FormControl style={{ width: '50%' }}>
        <Typography color='primary' marginTop={5}>
          Bounty Title
        </Typography>
        <TextField
          {...register('title')}
          variant='outlined'
          required
          inputProps={{ maxLength: 80 }}
          sx={{ backgroundColor: 'main', padding: 0.1 }}
        />

        <Typography color='primary' marginTop={5}>
          Org Name
        </Typography>
        <TextField
          {...register('funding_organization')}
          variant='outlined'
          required
          inputProps={{ maxLength: 40 }}
          sx={{ backgroundColor: 'main', padding: 0.1 }}
        />

        <Typography color='primary' marginTop={5}>
          Org URL
        </Typography>
        <TextField
          {...register('orginization_url')}
          variant='outlined'
          required
          sx={{ backgroundColor: 'main', padding: 0.1 }}
        />

        <Typography color='primary' marginTop={5}>
          Point of Contact Email
        </Typography>
        <TextField
          type='email'
          {...register('ways_to_contact')}
          variant='outlined'
          sx={{ backgroundColor: 'main', padding: 0.1 }}
        />

        <Typography color='primary' marginTop={5} marginBottom={2}>
          Upload Files and Attachments
        </Typography>
        <Button
          variant='contained'
          component='label'
          sx={{
            paddingTop: 1.5,
            paddingBottom: 1.5,
            backgroundColor: '#1db3f9',
            boxShadow: 'none',
            color: 'main',
            fontWeight: '600',
          }}
        >
          Upload Files
          <input
            alt='image in here'
            type='file'
            name='image'
            hidden
            multiple
            onChange={(e) => setFiles(e.target.files)}
          />{' '}
        </Button>
        {files ? showFilePaths(files) : null}
        <FormControlLabel
          sx={{ color: 'white', marginTop: 2 }}
          control={
            <Checkbox
              {...register('is_featured')}
              color='primary'
              checked={watch('is_featured')}
            />
          }
          label='Would you like to Feature your Bounty?'
        />
        <Typography color='subColor' fontWeight='600'>
          Note: Extra costs apply
        </Typography>

        <Typography color='main' marginTop={5}>
          Bounty Type (Select One)
        </Typography>
        <TextField
          select
          fullWidth
          defaultValue=''
          inputProps={register('bounty_type', {
            required: 'What is the type of bounty',
          })}
          error={errors.currency}
          helperText={errors.currency?.message}
          sx={{ backgroundColor: 'main', padding: 0.1 }}
        >
          {bountyTypes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Typography color='main' marginTop={5}>
          Length of Project
        </Typography>
        <TextField
          select
          fullWidth
          defaultValue=''
          inputProps={register('project_length', {
            required: 'Add an est. time for the project',
          })}
          error={errors.currency}
          helperText={errors.currency?.message}
          sx={{ backgroundColor: 'main', padding: 0.1 }}
        >
          {projectLength.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Typography color='main' marginTop={5}>
          Category
        </Typography>
        <Select
          {...register('bounty_category')}
          multiple
          defaultValue={[]}
          sx={{ backgroundColor: 'main', padding: 0.1, borderRadius: 0 }}
        >
          {bountyCategories.map((option) => (
            <MenuItem value={option} key={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        <Typography color='main' marginTop={5}>
          Bounty reward in usd
        </Typography>
        <Typography variant='body2' fontWeight='600' color='#757575'>
          *will be paid out in eth
        </Typography>
        <TextField
          {...register('bounty_value_in_usd', {
            valueAsNumber: true,
          })}
          variant='outlined'
          default={100}
          required
          sx={{ backgroundColor: 'main', padding: 0.1, borderRadius: 0 }}
        />

        <Typography color='main' marginTop={5}>
          Optional: url of Job Description
        </Typography>
        <TextField
          {...register('attached_job_url')}
          placeholder='URL'
          variant='outlined'
          sx={{ backgroundColor: 'main', padding: 0.1, borderRadius: 0 }}
        />
      </FormControl>

      <Typography marginTop={5} variant='h6'>
        Description
      </Typography>
      <Typography fontWeight='600' color='#757575' variant='body2'>
        The most successful bounties will be the most in depth about what's
        needed!
      </Typography>
      <MDEditor
        style={{ marginTop: 20 }}
        height={500}
        value={description}
        onChange={setDescription}
      />

      <Button
        variant='contained'
        sx={{
          borderRadius: 0,
          boxShadow: 'none',
          marginTop: 5,
          marginBottom: 20,
          fontSize: 18,
          backgroundColor: '#1db3f9',
          color: 'main',
          '&:hover': {
            backgroundColor: 'rgb(29,179,249, 0.7)'
        },
        }}
        onClick={
          loading ? null : handleSubmit((formData) => saveBounty(formData))
        }
      >
        Create Bounty
      </Button>
    </Container>
  );
}

function WalletNotConnectedText() {
  return (
    <Box
      display='flex'
      alignText='center'
      justifyContent='center'
      marginTop='33%'
    >
      <Typography variant='h3' color='main'>
        Wallet Not Connected!
      </Typography>
    </Box>
  );
}
