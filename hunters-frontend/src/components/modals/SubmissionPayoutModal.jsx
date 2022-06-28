import {
  Button,
  Card,
  CircularProgress,
  Modal,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { stateEmojis, stateValue } from '../../utils/objects';
import { useEthPrice } from '../../contexts/EthPrice';
import { sendTransaction } from '../../utils/helpers';
import { useProfile } from '../../contexts/ProfileContext';
import { useNavigate } from 'react-router-dom';

export default function SubmissionPayoutModal({
  submission,
  open,
  handleClose,
}) {
  const { walletAddress } = useProfile();
  const navigate = useNavigate();
  const ethPrice = useEthPrice();

  const [bounty, setBounty] = useState(null);
  const [submissionOwner, setSubmissionOwner] = useState(null);
  const [loading, setLoading] = useState(null);

  const state = ['open', 'done', 'cancelled', 'expired'];

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/bounty/${submission.bounty}/`
      )
      .then((res) => {
        setBounty(res.data);
      })
      .catch((err) => console.log('😢 ' + err));
  }, [submission.bounty]);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/profile/${submission.profile}/`
      )
      .then((res) => setSubmissionOwner(res.data))
      .catch((err) => console.log(err));
  }, [submission.profile]);

  if (bounty == null) {
    return null;
  }

  if (walletAddress !== bounty.bounty_creator) {
    return null;
  }

  const handleStateChange = (e) => {
    setBounty({ ...bounty, state: e.target.value });
  };

  // TODO We need to show a loading bar
  const handleDBChanges = async () => {
    const activity = {
      bounty: bounty.id,
      wallet_address: walletAddress,
      activity_type: 'Work Approved',
    };
    axios
      .patch(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bounty.id}/`, {
        bounty: bounty,
        activities: activity,
      })
      .then((res) => console.log('res', res))
      .catch((err) => console.log(err));

    axios
      .patch(
        `${process.env.REACT_APP_DEV_SERVER}/api/work_submission/${submission.id}/`,
        {
          work_submission: { accepted: true },
        }
      )
      .then(() => navigate(`/profile/${walletAddress}/`));
    setLoading(false);
  };

  const handleAcceptance = async () => {
    setLoading(true);
    sendTransaction(bounty.bounty_creator, submissionOwner.wallet_address)
      .then((txn) => {
        console.log('success', txn);
        handleDBChanges();
      })
      .catch(() => setLoading(false));
  };

  return (
    <Modal
      sx={{
        position: 'absolute',
        top: '20%',
        left: '33%',
      }}
      open={open}
      onClose={handleClose}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          height: 500,
          width: 550,
          justifyContent: 'flex-start',
          padding: 5,
          borderRadius: 0,
        }}
      >
        <Typography variant='h5' marginBottom={3}>
          Accepting submission from
          <Typography variant='h5' fontWeight='600'>
            {submission.submission_header}
          </Typography>
        </Typography>
        <Typography fontWeight='600'>Bounty Status after Acceptance</Typography>
        <Select
          fullWidth
          value={bounty.state}
          onChange={handleStateChange}
          sx={{ padding: 0.1, borderRadius: 0 }}
        >
          {state.map((option) => (
            <MenuItem value={option} key={option}>
              {stateEmojis[option] + ' ' + stateValue[option]}
            </MenuItem>
          ))}
        </Select>
        <Typography marginTop={4} fontWeight='600'>
          Total payment for Completion
        </Typography>
        <Typography marginTop={2} fontWeight='600'>
          ${bounty.bounty_value_in_usd} usd
        </Typography>
        <Typography marginTop={1} variant='body2' sx={{ color: '#757575' }}>
          *Paid out in (estimated) {ethPrice / bounty.bounty_value_in_usd} eth
        </Typography>
        <Button
          onClick={handleAcceptance}
          variant='contained'
          disabled={loading}
          sx={{
            backgroundColor: '#4870f6',
            fontSize: 18,
            fontWeight: 600,
            padding: 2,
            marginTop: 4,
            color: 'white',
            boxShadow: 'none',
            borderRadius: 0,
            '&:hover': {
              boxShadow: 'none',
              backgroundColor: '#809DFF',
            },
            '&:disabled': {
              backgroundColor: '#809DFF',
            },
          }}
        >
          {loading ? (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          ) : null}
          Pay now with connected wallet
        </Button>
      </Card>
    </Modal>
  );
}
