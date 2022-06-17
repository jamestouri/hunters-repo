import { Box } from '@mui/system';
import React from 'react';
import { useProfile } from '../contexts/ProfileContext';

export default function Profile() {
    const {walletAddress} = useProfile();

    return (
        <Box>{walletAddress}</Box>
    )
}