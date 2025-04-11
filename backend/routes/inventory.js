const express = require('express');
const router = express.Router();
const {
    getAllInventoryItems,
    getInventoryItemById,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
} = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllInventoryItems).post(protect, addInventoryItem);
router.route('/:id').get(protect, getInventoryItemById).put(protect, updateInventoryItem).delete(protect, deleteInventoryItem);

module.exports = router;