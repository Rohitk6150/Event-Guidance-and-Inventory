import React from 'react';
import EditInventoryItem from '../components/inventory/EditInventoryItem';
import { Container } from '@mui/material';

const EditInventoryPage = () => {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <EditInventoryItem />
        </Container>
    );
};

export default EditInventoryPage;