import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const InventoryItemCard = ({ item }) => {
    return (
        <Card sx={{ maxWidth: 345, mb: 2 }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                </Typography>
                {item.description && (
                    <Typography variant="body2" color="text.secondary">
                        {item.description}
                    </Typography>
                )}
                <Typography variant="body1">
                    Quantity: {item.quantity} {item.unit}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" component={Link} to={`/inventory/${item._id}`}>View Details</Button>
                <Button size="small" component={Link} to={`/inventory/edit/${item._id}`}>Edit</Button>
            </CardActions>
        </Card>
    );
};

export default InventoryItemCard;