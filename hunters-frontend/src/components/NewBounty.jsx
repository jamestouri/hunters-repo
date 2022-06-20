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
  Switch,
  Select,
} from '@mui/material';
import { storeFilesInIPFS } from '../utils/helpers';

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
        <Typography>{f.name}</Typography>
      ))}
    </>
  );
}

export default function NewBounty() {
  const [files, setFiles] = useState([]);
  const [checked, setChecked] = useState(false);
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
    data = checked
      ? { ...data, bounty_value_in_usd: 1200 * data.bounty_value_in_eth }
      : {
          ...data,
          bounty_value_in_eth: (data.bounty_value_in_usd / 1200).toFixed(10),
        };

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
    <>
      <FormControl>
        <Typography>Bounty Title</Typography>
        <TextField {...register('title')} variant='standard' required />

        <Typography marginTop={3}>Org Name</Typography>
        <TextField
          {...register('funding_organization')}
          variant='standard'
          required
        />

        <Typography marginTop={3}>Org URL</Typography>
        <TextField
          {...register('orginization_url')}
          variant='standard'
          required
        />

        <Typography marginTop={3}>Point of Contact Email</Typography>
        <TextField {...register('ways_to_contact')} variant='standard' />

        <Typography marginTop={3} marginBottom={2}>
          Upload Files and Attachments
        </Typography>
        <Button variant='contained' component='label'>
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
          control={
            <Checkbox
              {...register('is_featured')}
              color='primary'
              checked={watch('is_featured')}
            />
          }
          label='Would you like to Feature your Bounty?'
        />
        <Typography>Note: Extra costs apply</Typography>

        <Typography marginTop={3}>Bounty Type (Select One)</Typography>
        <TextField
          select
          fullWidth
          defaultValue=''
          inputProps={register('bounty_type', {
            required: 'What is the type of bounty',
          })}
          error={errors.currency}
          helperText={errors.currency?.message}
        >
          {bountyTypes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Typography marginTop={3}>Length of Project</Typography>
        <TextField
          select
          fullWidth
          defaultValue=''
          inputProps={register('project_length', {
            required: 'Add an est. time for the project',
          })}
          error={errors.currency}
          helperText={errors.currency?.message}
        >
          {projectLength.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Typography>Category</Typography>
        <Select
          {...register('bounty_category')}
          labelId='age'
          label='age'
          multiple
          defaultValue={[]}
        >
          {bountyCategories.map((option) => (
            <MenuItem value={option} key={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Switch
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        {checked ? (
          <TextField
            {...register('bounty_value_in_eth', {
              valueAsNumber: true,
            })}
            label='Bounty reward in eth'
            variant='standard'
            required
          />
        ) : (
          <TextField
            {...register('bounty_value_in_usd', {
              valueAsNumber: true,
            })}
            label='Bounty reward in usd'
            variant='standard'
            required
          />
        )}

        <Typography>Optional: url of Job Description</Typography>
        <TextField
          {...register('attached_job_url')}
          placeholder='URL'
          variant='standard'
        />
      </FormControl>

      <Typography variant='h6'>Description</Typography>
      <Typography variant='body2'>
        The most successful bounties will be the most in depth in what's needed!
      </Typography>
      <MDEditor height={500} value={description} onChange={setDescription} />

      <Button
        onClick={
          loading ? null : handleSubmit((formData) => saveBounty(formData))
        }
      >
        Submit
      </Button>
    </>
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
      <Typography variant='h3'>Wallet Not Connected!</Typography>
    </Box>
  );
}
