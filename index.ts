import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import rateLimit from 'express-rate-limit';

import cors from 'cors';
app.use(cors());

import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

import vulcanClient from './vulcanClient.js';

import root from './routes/root.js';
import moses from './routes/moses.js';
import railwayWebhook from './routes/railwayWebhook.js';
import vulcan from './routes/vulcan.js';

(async () => {
    await vulcanClient.initialize();

    mongoose.connect(process.env.MONGO_URI);
    console.log('Conected to MongoDB!');

    const limiter = rateLimit({
        windowMs: 10 * 60000, // 10 minutes
        max: 100,
        message: "Hold your horses... You're beeing rate limited. You can only make max 100 requests every 10 minutes.",
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use(limiter);
    app.use('/', root);
    app.use('/moses', moses);
    app.use('/vulcan', vulcan);
    app.use('/railwayWebhook', railwayWebhook);
})();

app.listen(process.env.PORT || 5000, () => console.log('Server is running'));
