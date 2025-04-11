import React from 'react';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from '@mui/lab';
import { Typography, Paper, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const EventTimeline = ({ milestones }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckCircleIcon color="success" />;
            case 'In Progress':
                return <AccessTimeIcon color="warning" />;
            case 'To Do':
            default:
                return <RemoveCircleOutlineIcon color="action" />;
        }
    };

    return (
        <Timeline position="alternate">
            {milestones && milestones.map((milestone, index) => (
                <TimelineItem key={index}>
                    <TimelineSeparator>
                        <TimelineDot color={milestone.status === 'Completed' ? 'success' : (milestone.status === 'In Progress' ? 'warning' : 'primary')}>
                            {getStatusIcon(milestone.status)}
                        </TimelineDot>
                        {index < milestones.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6" component="span">
                                {milestone.name}
                            </Typography>
                            <Typography sx={{ mt: 0.5 }} color="textSecondary">
                                Due Date: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'Not Set'}
                            </Typography>
                            <Typography>
                                Status: {milestone.status}
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
};

export default EventTimeline;