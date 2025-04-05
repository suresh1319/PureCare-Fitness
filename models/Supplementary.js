const mongoose = require('mongoose');

const supplementarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product must have a name'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Product must have a category'],
        enum: ['protein', 'preworkout', 'vitamins', 'weightGainer', 'fatBurner', 'bcaa', 'equipment', 'accessories']
    },
    description: {
        type: String,
        required: [true, 'Product must have a description']
    },
    price: {
        type: Number,
        required: [true, 'Product must have a price']
    },
    brand: {
        type: String,
        required: [true, 'Product must have a brand']
    },
    stock: {
        type: Number,
        required: [true, 'Product must have stock quantity'],
        min: [0, 'Stock cannot be negative']
    }
});

// Index for searching products
supplementarySchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Supplementary', supplementarySchema); 