import React from 'react';
import EventDetails from '../components/events/EventDetails';
import { Container } from '@mui/material';

const EventDetailPage = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <EventDetails />
        </Container>
    );
};

export default EventDetailPage;