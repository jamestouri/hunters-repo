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

export default function SubmissionPayoutModal({
  submission,
  open,
  handleClose,
}) {
  const [bountyStatus, setBountyStatus] = useState(null);
  const [bountyPayout, setBountyPayout] = useState(null);

  const state = ['open', 'done', 'cancelled', 'expired'];

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_DEV_SERVER}/api/bounty/${submission.bounty}/`
      )
      .then((res) => {
        setBountyStatus(res.data.state);
        setBountyPayout(res.data.bounty_value_in_usd);
      })
      .catch((err) => console.log('😢 ' + err));
  }, [submission.bounty]);

  if (bountyStatus == null) {
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
          {submission.project_link}?
        </Typography>
        <Typography>Bounty Status</Typography>
        <Select
          fullWidth
          value={bountyStatus}
          onChange={setBountyStatus}
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
        <Typography>Paid out in eth</Typography>
        <Button>Pay now with connected wallet</Button>
      </Card>
    </Modal>
  );
}
