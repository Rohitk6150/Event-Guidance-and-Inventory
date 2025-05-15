import React from 'react';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import { Typography, Paper } from '@mui/material';

const EventTimeline = ({ milestones }) => {
    return (
        <Timeline>
            {milestones.map((milestone, index) => (
                <TimelineItem key={index}>
                    <TimelineOppositeContent color="text.secondary">
                        {new Date(milestone.date).toLocaleDateString()}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color={milestone.completed ? "success" : "primary"} />
                        {index < milestones.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6" component="h1">
                                {milestone.title}
                            </Typography>
                            <Typography>{milestone.description}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Status: {milestone.completed ? 'Completed' : 'Pending'}
                            </Typography>
                        </Paper>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    );
};

export default EventTimeline;