import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    quote: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    quoteId: {
        type: Number,
        required: false,
    },
    submitterName: {
        type: String,
        required: true,
    },
    submitterId: {
        type: String,
        required: true,
    },
});

export default mongoose.model('moses-quotes', schema, 'moses-quotes');
