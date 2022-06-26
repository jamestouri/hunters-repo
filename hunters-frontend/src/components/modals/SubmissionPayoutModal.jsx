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

export default function SubmissionPayoutModal({
  submission,
  open,
  handleClose,
}) {
  const { walletAddress } = useProfile();
  const [bountyStatus, setBountyStatus] = useState(null);
  const [bountyPayout, setBountyPayout] = useState(null);
  const [bountyCreatorWallet, setBountyCreatorWallet] = useState(null);
  const [submissionOwner, setSubmissionOwner] = useState(null);

  const ethPrice = useEthPrice();

  const state = ['open', 'done', 'cancelled', 'expired'];

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/bounty/${submission.bounty}/`
      )
      .then((res) => {
        setBountyStatus(res.data.state);
        setBountyPayout(res.data.bounty_value_in_usd);
        setBountyCreatorWallet(res.data.bounty_creator);
      })
      .catch((err) => console.log('😢 ' + err));
  }, [submission.bounty]);

  useEffect(() => {
    axios 
    .get(
      `${process.env.REACT_APP_DEV_SERVER}/api/profile/${submission.profile}/`
    )
    .then((res) => setSubmissionOwner(res.data))
    .catch(err => console.log(err));
  }, [submission.profile])

  if (bountyStatus == null) {
    return null;
  }

  if (walletAddress !== bountyCreatorWallet) {
    return null;
  }

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
          value={bountyStatus}
          onChange={(e) => setBountyStatus(e.target.value)}
          sx={{ padding: 0.1, borderRadius: 0 }}
        >
          {state.map((option) => (
            <MenuItem value={option} key={option}>
              {stateEmojis[option] + ' ' + stateValue[option]}
            </MenuItem>
          ))}
        </Select>
        <Typography>Total payment for Completion</Typography>
        <Typography>{bountyPayout}</Typography>
        <Typography>Paid out in {ethPrice / bountyPayout} eth</Typography>
        <Button
          onClick={() => sendTransaction(bountyCreatorWallet, submissionOwner.wallet_address)}
          variant='contained'
          sx={{ color: 'black', boxShadow: 'none', borderRadius: 0 }}
        >
          Pay now with connected wallet
        </Button>
      </Card>
    </Modal>
  );
}
