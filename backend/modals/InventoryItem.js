const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    unit: {
        type: String,
        trim: true,
    },
    // Optionally track who added the item
    // addedBy: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },
}, {
    timestamps: true,
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

module.exports = InventoryItem;