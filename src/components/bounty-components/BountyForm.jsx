import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { RE_FOR_URL } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import { useProfile } from '../../contexts/ProfileContext';
import {
  Box,
  CircularProgress,
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
} from '@mui/material';
import { useFormik } from 'formik';
import {
  completePaymentUponBountyCreation,
  storeFilesInIPFS,
} from '../../utils/helpers';
import { useEthPrice } from '../../contexts/EthPrice';

const textFieldStyle = {
  backgroundColor: 'main',
  padding: 0.1,
  marginTop: 2,
};

const projectLength = ['Hours', 'Days', 'Weeks', 'Months'];

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

// For Creating and Editing Bounties
export default function BountyForm() {
  const params = useParams();
  const { walletAddress } = useProfile();
  const navigate = useNavigate();
  const ethPrice = useEthPrice();

  const [files, setFiles] = useState([]);
  const [bounty, setBounty] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [error, setError] = useState(false);
  const bountyId = params.bountyId;

  //  I would put this in a different component but TotalCost needs this value
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    if (bountyId) {
      axios
        .get(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bountyId}/`)
        .then((res) => {
          setBounty(res.data);
          setDescription(res.data.description);
          // eventually setFiles will change according to it too
        })
        .catch((err) => console.log(err));
    }
  }, [bountyId]);

  useEffect(() => {
    // Quick way to reduce the number of hits to the server
    if (couponCode.length > 4) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_DEV_SERVER}/api/coupon/${couponCode}/`)
        .then((res) => {
          console.log(res);
          if (res.data) {
            setCoupon(res.data);
          } else {
            setCoupon(null);
          }
        })
        .catch(() => setCoupon(null));
      setLoading(false);
    } else {
      setCoupon(null);
    }
  }, [couponCode]);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(8, 'At least 8 characters')
      .max(80, 'No more than 80 characters'),
    funding_organization: Yup.string().required('Org Name is required'),
    organization_url: Yup.string().matches(RE_FOR_URL, 'URL not valid'),
    ways_to_contact: Yup.string()
      .email('Please enter a valid Email')
      .required('Email is required'),
    is_featured: Yup.bool().default(false),
    bounty_type: Yup.string().required('What is the type of bounty'),
    project_length: Yup.string().required('Add an est. time for the project'),
    bounty_category: Yup.array().default([]),
    bounty_value_in_usd: Yup.number().required(
      'How much will completion of this bounty be paid out?'
    ),
    attached_job_url: Yup.string()
      .matches(RE_FOR_URL, 'URL not valid')
      .nullable(),
  });

  const initialValues = {
    title: bounty ? bounty.title : '',
    funding_organization: bounty ? bounty.funding_organization : '',
    organization_url: bounty ? bounty.organization_url : '',
    ways_to_contact: bounty ? bounty.ways_to_contact : '',
    is_featured: bounty ? bounty.is_featured : false,
    bounty_type: bounty ? bounty.bounty_type : '',
    project_length: bounty ? bounty.project_length : '',
    bounty_category: bounty ? bounty.bounty_category : [],
    bounty_value_in_usd: bounty ? bounty.bounty_value_in_usd : 1000,
    attached_job_url: bounty ? bounty.attached_job_url : '',
    description: bounty ? bounty.description : '',
  };

  const formik = useFormik({
    initialValues: bounty ? bounty : initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) =>
      bountyId
        ? await saveBountyEdits(values)
        : await bountyCreationFlow(values),
    enableReinitialize: true,
  });

  // The ever changing value of totalCost
  useEffect(() => {
    const bountyCost = formik.values.bounty_value_in_usd;
    if (coupon != null) {
      const couponDiscount = (100 - coupon.discount_amount) / 100;
      setTotalCost(bountyCost * 0.05 * couponDiscount);
    } else {
      setTotalCost(bountyCost * 0.05);
    }
  }, [formik.values.bounty_value_in_usd, coupon]);

  const catchSets = () => {
    setLoading(false);
    setError(true);
  };

  const bountyCreationFlow = async (formData) => {
    setLoading(true);
    // If 100% promo coupon is used then no need to send payment
    if (totalCost === 0) {
      await createBounty(formData, null);
    } else {
      completePaymentUponBountyCreation(walletAddress, totalCost / ethPrice)
        .then((res) => createBounty(formData, res.transactionHash))
        .catch(() => catchSets());
    }
  };

  const createBounty = async (formData, txnHash) => {
    let data = { ...formData, bounty_creator: walletAddress };
    // Image files
    const attachedFiles = await storeFilesInIPFS(files);
    data = {
      ...data,
      image_attachments: attachedFiles,
      description: description,
    };

    const bounty = await axios
      .post(`${process.env.REACT_APP_DEV_SERVER}/api/bounties/`, {
        bounty: data,
      })
      .catch((err) => {
        catchSets();
        console.log(err);
      });

    await axios
      .patch(`${process.env.REACT_APP_DEV_SERVER}/api/coupon/${couponCode}/`, {
        coupon: { active: false },
      })
      .then((res) => console.log('👍 success', res))
      .catch((err) => console.log(err));

    // toFixed() is inconsistent
    const amount_eth =
      Math.round((totalCost / ethPrice) * Math.pow(10, 9)) / Math.pow(10, 9);
    const txnObject = {
      txn_hash: txnHash,
      sender_wallet_address: walletAddress,
      receiver_wallet_address: process.env.REACT_APP_WALLET_FOR_PAYMENTS,
      amount_usd: totalCost,
      amount_eth: amount_eth,
      txn_type: 'Bounty Creation',
      bounty: bounty.data.id,
    };
    await axios
      .post(`${process.env.REACT_APP_DEV_SERVER}/api/transactions/`, {
        transaction: txnObject,
      })
      .catch((err) => {
        catchSets();
        console.log(err);
      });

    setLoading(false);
    navigate(`/bounty/${bounty.data.id}/`);
  };

  const saveBountyEdits = async (formData) => {
    setLoading(true);
    let data = { ...formData, description: description };
    // Create Activity that made edits to existing Bouny
    const activity = {
      bounty: bounty.id,
      wallet_address: walletAddress,
      activity_type: 'Edited Bounty',
    };
    await axios
      .patch(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bountyId}/`, {
        bounty: data,
        activities: activity,
      })
      .then((res) => {
        console.log('✅ bounty edited', res);
        navigate(`/bounty/${res.data.id}/`);
      })
      .catch(() => catchSets());
    setLoading(false);
  };

  function showFilePaths(files) {
    const fileArr = Array.from(files);
    return (
      <>
        {fileArr.map((f) => (
          <Typography key={f.name} color='main'>
            {f.name}
          </Typography>
        ))}
      </>
    );
  }

  // Checks to make sure the right user is on the page
  if (bountyId && bounty == null) {
    return null;
  }

  if (!walletAddress) return <WalletNotConnectedText />;

  if (bountyId && bounty.bounty_creator !== walletAddress) {
    return null;
  }

  return (
    <Container>
      <Typography color='primary' variant='h4'>
        {bountyId ? 'Edit Bounty' : 'Create Bounty'}
      </Typography>
      <FormControl style={{ width: '50%' }}>
        <Title text={'Bounty Title'} />
        <TextField
          fullWidth
          id='title'
          name='title'
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          variant='outlined'
          required
          inputProps={{ maxLength: 80 }}
          sx={textFieldStyle}
        />

        <Title text={'Org Name'} />
        <TextField
          fullWidth
          id='funding_organization'
          name='funding_organization'
          value={formik.values.funding_organization}
          onChange={formik.handleChange}
          error={
            formik.touched.funding_organization &&
            Boolean(formik.errors.funding_organization)
          }
          helperText={
            formik.touched.funding_organization &&
            formik.errors.funding_organization
          }
          variant='outlined'
          required
          sx={textFieldStyle}
        />

        <Title text={'Org URL'} />
        <TextField
          fullWidth
          id='organization_url'
          name='organization_url'
          value={formik.values.organization_url}
          onChange={formik.handleChange}
          error={
            formik.touched.organization_url &&
            Boolean(formik.errors.organization_url)
          }
          helperText={
            formik.touched.organization_url && formik.errors.organization_url
          }
          variant='outlined'
          required
          sx={textFieldStyle}
        />

        <Title text={'Point of Contact Email'} />
        <TextField
          fullWidth
          id='ways_to_contact'
          name='ways_to_contact'
          value={formik.values.ways_to_contact}
          onChange={formik.handleChange}
          error={
            formik.touched.ways_to_contact &&
            Boolean(formik.errors.ways_to_contact)
          }
          helperText={
            formik.touched.ways_to_contact && formik.errors.ways_to_contact
          }
          variant='outlined'
          required
          sx={textFieldStyle}
        />
        {bountyId ? null : (
          <>
            <Typography
              color='primary'
              marginTop={5}
              marginBottom={2}
              fontWeight={600}
              fontSize={18}
            >
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
            </Button>{' '}
          </>
        )}
        {files ? showFilePaths(files) : null}
        {/* Hold off on the isFeatured for now  */}
        {/* {!bountyId || bounty.is_featured === false ? (
          <FormControlLabel
            sx={{ color: 'white', marginTop: 2 }}
            name='is_featured'
            id='is_featured'
            control={
              <Checkbox
                sx={{
                  backgroundColor: 'black',
                  color: 'white',
                }}
                checked={formik.values.is_featured}
                onChange={formik.handleChange}
              />
            }
            label='Would you like to Feature your Bounty?'
          />
        ) : null}
        <Typography color='subColor' fontWeight='600' marginLeft={4}>
          Note: Extra costs apply
        </Typography> */}

        <Title text={'Bounty Type: Select One'} />

        <TextField
          fullWidth
          select
          id='bounty_type'
          name='bounty_type'
          value={formik.values.bounty_type}
          onChange={formik.handleChange}
          error={
            formik.touched.bounty_type && Boolean(formik.errors.bounty_type)
          }
          helperText={formik.touched.bounty_type && formik.errors.bounty_type}
          variant='outlined'
          required
          sx={textFieldStyle}
        >
          {bountyTypes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <Title text={'Length of Project'} />
        <TextField
          fullWidth
          select
          id='project_length'
          name='project_length'
          value={formik.values.project_length}
          onChange={formik.handleChange}
          error={
            formik.touched.project_length &&
            Boolean(formik.errors.project_length)
          }
          helperText={
            formik.touched.project_length && formik.errors.project_length
          }
          variant='outlined'
          required
          sx={textFieldStyle}
        >
          {projectLength.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <Title text={'Category'} />

        <Select
          fullWidth
          id='bounty_category'
          name='bounty_category'
          value={formik.values.bounty_category}
          onChange={formik.handleChange}
          multiple
          sx={{ backgroundColor: 'main', padding: 0.1, borderRadius: 0 }}
        >
          {bountyCategories.map((option) => (
            <MenuItem value={option} key={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        <Title text={'Bounty reward in usd'} />
        <Typography variant='body2' fontWeight='600' color='#757575'>
          *will be paid out in eth
        </Typography>
        <TextField
          fullWidth
          id='bounty_value_in_usd'
          name='bounty_value_in_usd'
          value={formik.values.bounty_value_in_usd}
          onChange={formik.handleChange}
          error={
            formik.touched.bounty_value_in_usd &&
            Boolean(formik.errors.bounty_value_in_usd)
          }
          helperText={
            formik.touched.bounty_value_in_usd &&
            formik.errors.bounty_value_in_usd
          }
          variant='outlined'
          required
          sx={textFieldStyle}
        />

        <Title text={'Optional: url of Job Description'} />
        <TextField
          fullWidth
          id='attached_job_url'
          name='attached_job_url'
          value={formik.values.attached_job_url}
          onChange={formik.handleChange}
          error={
            formik.touched.attached_job_url &&
            Boolean(formik.errors.attached_job_url)
          }
          helperText={
            formik.touched.attached_job_url && formik.errors.attached_job_url
          }
          variant='outlined'
          sx={textFieldStyle}
        />
      </FormControl>
      <Typography marginTop={5} variant='h6' color='primary' fontWeight={600}>
        Description
      </Typography>
      <Typography
        fontWeight='600'
        color='#757575'
        variant='body2'
        marginTop={2}
      >
        The most successful bounties will be the most in depth about what's
        needed!
      </Typography>
      <MDEditor
        style={{ marginTop: 20 }}
        height={500}
        value={description}
        onChange={setDescription}
      />
      <Title text={'**Got Promo Code?**'} color='#e41f66' />
      {!bountyId ? (
        <TextField
          sx={{ ...textFieldStyle, width: '33%', marginBottom: 1 }}
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
      ) : null}
      <CouponAdjustment coupon={coupon} couponCode={couponCode} />
      {Object.keys(formik.errors).length ? (
        <Typography sx={{ marginTop: 5, color: '#fb1c48', fontWeight: '600' }}>
          Please scroll up to fix errors
        </Typography>
      ) : null}
      <ButtonAction
        bountyId={bountyId}
        totalCost={totalCost}
        formik={formik}
        loading={loading}
        error={error}
      />
    </Container>
  );
}

function Title({ text, fontSize = 18, color = 'main' }) {
  return (
    <Typography
      color={color}
      marginTop={5}
      fontWeight='600'
      fontSize={fontSize}
    >
      {text}
    </Typography>
  );
}

function CouponAdjustment({ coupon, couponCode }) {
  if (coupon && coupon.active === true) {
    return <Typography color='main'>✅ Coupon Confirmed 🙂</Typography>;
  } else if (coupon == null && couponCode.length > 0) {
    return <Typography color='#fb1c48'>😢 Invalid Coupon</Typography>;
  } else {
    return null;
  }
}

const buttonStyling = {
  borderRadius: 0,
  boxShadow: 'none',
  marginTop: 5,
  fontSize: 18,
  backgroundColor: '#1db3f9',
  color: 'main',
  '&:hover': {
    backgroundColor: 'rgb(29,179,249, 0.7)',
  },
  '&:disabled': {
    backgroundColor: 'rgb(29,179,249, 0.7)',
  },
};

function ButtonAction({ bountyId, totalCost, formik, loading, error }) {
  if (!bountyId) {
    return (
      <Box position='relative'>
        <Button
          onClick={formik.handleSubmit}
          variant='contained'
          disabled={loading}
          sx={buttonStyling}
        >
          {loading ? (
            <CircularProgress
              size={18}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          ) : null}
          Create Bounty
        </Button>
        {error ? (
          <Typography color='#fb1c48'>
            Something went wrong, please try again later
          </Typography>
        ) : null}
        <Typography color='main' marginTop={2}>
          Total Cost: ${totalCost} USD (5% of bounty reward)
        </Typography>
        <Typography color='subColor' marginBottom={15} fontWeight='600'>
          *Paid out in Eth
        </Typography>
      </Box>
    );
  }

  return (
    <Button
      onClick={formik.handleSubmit}
      variant='contained'
      disabled={loading}
      sx={buttonStyling}
    >
      {loading ? (
        <CircularProgress
          size={18}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      ) : null}
      Save Changes
    </Button>
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
