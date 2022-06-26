import {
  Button,
  Card,
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
  const [bounty, setBounty] = useState(null);
  const [submissionOwner, setSubmissionOwner] = useState(null);
  const navigate = useNavigate();
  const ethPrice = useEthPrice();

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
  }

  const handleAcceptance = async () => {
    sendTransaction(bounty.bounty_creator, submissionOwner.wallet_address).then((txn) => {
      console.log('success', txn)
      handleDBChanges();
    })
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
          alignItems: 'center',
          height: 750,
          width: 550,
          justifyContent: 'center',
        }}
      >
        <Typography>
          Are you sure you want to accept submission from{' '}
          {submission.submission_header}?
        </Typography>
        <Typography>Bounty Status after Acceptance</Typography>
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
        <Typography>Total payment for Completion</Typography>
        <Typography>{bounty.bounty_value_in_usd}</Typography>
        <Typography>
          Paid out in {ethPrice / bounty.bounty_value_in_usd} eth
        </Typography>
        <Button
          onClick={handleAcceptance}
          variant='contained'
          sx={{ color: 'black', boxShadow: 'none', borderRadius: 0 }}
        >
          Pay now with connected wallet
        </Button>
      </Card>
    </Modal>
  );
}
