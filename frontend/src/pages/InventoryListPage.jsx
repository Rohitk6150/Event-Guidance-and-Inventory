import React from 'react';
import InventoryList from '../components/inventory/InventoryList';
import { Container } from '@mui/material';

const InventoryListPage = () => {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <InventoryList />
        </Container>
    );
};

export default InventoryListPage;