import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A trainer must have a name'],
        trim: true
    },
    specialization: {
        type: String,
        required: [true, 'A trainer must have a specialization']
    },
    experience: {
        type: Number,
        required: [true, 'A trainer must have years of experience']
    },
    hourlyRate: {
        type: Number,
        required: [true, 'A trainer must have an hourly rate']
    },
    gym: {
        type: mongoose.Schema.ObjectId,
        ref: 'Gym',
        required: [true, 'A trainer must be associated with a gym']
    },
    sessions: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date
        },
        timeSlot: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending'
        }
    }]
});

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer; 