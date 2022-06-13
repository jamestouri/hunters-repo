import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { create } from 'ipfs-http-client';
import FileUpload from 'react-mui-fileuploader';
import axios from 'axios';
import { useProfile } from '../contexts/ProfileContext';

import {
  Button,
  FormControl,
  TextField,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Switch,
} from '@mui/material';

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

export default function NewBounty() {
  const [form, setForm] = useState('');
  const [files, setFiles] = useState([]);
  const [checked, setChecked] = useState(false);

  const { formState, register, handleSubmit, watch } = useForm();
  const { walletAddress } = useProfile();
  //  Bounty creator added with wallet address
  const { errors } = formState;

  function saveBounty() {
    let data = { ...files, bounty_creator: walletAddress };
    // add images from ipfs
    data = checked
      ? { ...data, bounty_value_in_usd: 1200 * data.bounty_value_in_eth }
      : { ...data, bounty_value_in_usd: data.bounty_value_in_eth / 1200 };

    axios
      .post(`${process.env.REACT_APP_DEV_SERVER}/api/bounties/`, {
        bounty: data,
      })
      .then((res) => console.log('bounty created', res))
      .catch((err) => console.log(err));
  }

  console.log(checked);

  return (
    <FormControl
    //   onSubmit={handleSubmit((data) => setForm(JSON.stringify(data)))}
    >
      <TextField
        {...register('title')}
        placeholder='title'
        variant='standard'
        required
      />
      <TextField
        {...register('description')}
        placeholder='description'
        variant='outlined'
        multiline
        rows={10}
        maxRows={30}
        required
      />
      <TextField
        {...register('funding_organization')}
        placeholder='Org name'
        variant='standard'
        required
      />
      <TextField
        {...register('orginization_url')}
        placeholder='Org url'
        variant='standard'
        required
      />
      <TextField
        {...register('ways_to_contact')}
        placeholder='Point of Contact Email'
        variant='standard'
      />
      {/* <DropzoneArea onChange={(files) => setFiles(files)} /> */}
      {/* <Button variant='contained' component='label'>
        Upload File
        <input type='file' hidden multiple onChange={(e) => setFiles([e.target.value])} />
      </Button> */}
      <FileUpload
        multiFile={true}
        disabled={false}
        title=''
        header=''
        leftLabel='drag or'
        rightLabel='to select files'
        buttonLabel='click here'
        buttonRemoveLabel='Remove all'
        maxFileSize={10}
        maxUploadFiles={0}
        maxFilesContainerHeight={357}
        errorSizeMessage={'fill it or move it to use the default error message'}
        onFilesChange={(files) => setFiles(files)}
        onError={() => console.log('hi')}
      />

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
      <TextField
        select
        fullWidth
        label='Bounty Type'
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
      <TextField
        select
        fullWidth
        label='Length of Project'
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
      <TextField
        select
        fullWidth
        defaultValue=''
        inputProps={register('bounty_category', {
          required: 'What category is your bounty',
        })}
        error={errors.currency}
        helperText={errors.currency?.message}
      >
        {bountyCategories.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
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
      <Button onClick={handleSubmit((data) => saveBounty(data))}>
        Submit
      </Button>
    </FormControl>
  );
}
