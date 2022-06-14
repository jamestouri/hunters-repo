import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function BountyDetails() {
    const params = useParams();
    const [bounty, setBounty] = useState(null);

    const bountyId = params.bountyId;


    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_DEV_SERVER}/api/bounty/${bountyId}/`)
            .then(res => setBounty(res.data))
            .catch(err => console.log('😢 ' + err ))
    }, [])
    console.log(bounty);
    return (<div>hi</div>)
}