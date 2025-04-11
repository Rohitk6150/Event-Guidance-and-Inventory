import React from 'react';
import CreateEvent from '../components/events/CreateEvent';
import { Container } from '@mui/material';

const CreateEventPage = () => {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <CreateEvent />
        </Container>
    );
};

export default CreateEventPage;