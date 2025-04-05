import mongoose from 'mongoose';

const gymSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A gym must have a name'],
        unique: true,
        trim: true
    },
    location: {
        type: String,
        required: [true, 'A gym must have a location']
    },
    contact: {
        phone: {
            type: String,
            required: [true, 'A gym must have a contact number']
        },
        email: {
            type: String,
            required: [true, 'A gym must have an email']
        }
    },
    monthlyPrice: {
        type: Number,
        required: [true, 'A gym must have a monthly price']
    },
    capacity: {
        type: Number,
        required: [true, 'A gym must have a capacity']
    }
});

// Virtual populate for reviews
gymSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'gym',
    localField: '_id'
});

const Gym = mongoose.model('Gym', gymSchema);

export default Gym; 