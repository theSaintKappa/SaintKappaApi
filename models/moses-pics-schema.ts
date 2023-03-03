import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now(),
    },
    uploader: {
        id: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
    },
    size: {
        type: Number,
        required: true,
    },
    dimensions: {
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
    },
    contentType: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
});

export default mongoose.model('moses-pics', schema, 'moses-pics');
