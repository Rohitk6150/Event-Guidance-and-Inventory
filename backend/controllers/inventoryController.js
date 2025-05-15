const asyncHandler = require('express-async-handler');
const InventoryItem = require('../modals/InventoryItem');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
const getAllInventoryItems = asyncHandler(async (req, res) => {
    const inventoryItems = await InventoryItem.find({}); // Or filter
    res.json(inventoryItems);
});

// @desc    Get inventory item by ID
// @route   GET /api/inventory/:id
// @access  Private
const getInventoryItemById = asyncHandler(async (req, res) => {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    if (inventoryItem) {
        res.json(inventoryItem);
    } else {
        res.status(404);
        throw new Error('Inventory item not found');
    }
});

// @desc    Add a new inventory item
// @route   POST /api/inventory
// @access  Private
const addInventoryItem = asyncHandler(async (req, res) => {
    const { name, description, quantity, unit } = req.body;
    const inventoryItem = await InventoryItem.create({
        name,
        description,
        quantity,
        unit,
        // addedBy: req.user._id,
    });
    res.status(201).json(inventoryItem);
});

// @desc    Update an inventory item
// @route   PUT /api/inventory/:id
// @access  Private
const updateInventoryItem = asyncHandler(async (req, res) => {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    if (inventoryItem) {
        inventoryItem.name = req.body.name || inventoryItem.name;
        inventoryItem.description = req.body.description || inventoryItem.description;
        inventoryItem.quantity = req.body.quantity || inventoryItem.quantity;
        inventoryItem.unit = req.body.unit || inventoryItem.unit;

        const updatedInventoryItem = await inventoryItem.save();
        res.json(updatedInventoryItem);
    } else {
        res.status(404);
        throw new Error('Inventory item not found');
    }
});

// @desc    Delete an inventory item
// @route   DELETE /api/inventory/:id
// @access  Private
const deleteInventoryItem = asyncHandler(async (req, res) => {
    const inventoryItem = await InventoryItem.findById(req.params.id);
    if (inventoryItem) {
        await inventoryItem.deleteOne();
        res.json({ message: 'Inventory item removed' });
    } else {
        res.status(404);
        throw new Error('Inventory item not found');
    }
});

module.exports = {
    getAllInventoryItems,
    getInventoryItemById,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
};