const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllEvents).post(protect, createEvent);
router.route('/:id').get(protect, getEventById).put(protect, updateEvent).delete(protect, deleteEvent);

module.exports = router;