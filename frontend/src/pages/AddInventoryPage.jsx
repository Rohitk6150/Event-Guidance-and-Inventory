import React from 'react';
import AddInventoryItem from '../components/inventory/AddInventoryItem';
import { Container } from '@mui/material';

const AddInventoryPage = () => {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <AddInventoryItem />
        </Container>
    );
};

export default AddInventoryPage;