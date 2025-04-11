import React from 'react';
import EditEvent from '../components/events/EditEvent';
import { Container } from '@mui/material';

const EditEventPage = () => {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <EditEvent />
        </Container>
    );
};

export default EditEventPage;