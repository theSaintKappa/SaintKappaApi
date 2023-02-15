const app = require('express')();
const rateLimit = require('express-rate-limit');

require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const vulcanClient = require('./vulcanClient');

const root = require('./routes/root');
const moses = require('./routes/moses');
const railwayWebhook = require('./routes/railwayWebhook');
const vulcan = require('./routes/vulcan');

(async () => {
    await vulcanClient.initialize();

    mongoose.connect(process.env.MONGO_URI);
    console.log('Conected to MongoDB!');

    const limiter = rateLimit({
        windowMs: 100,
        max: 1,
        message: "Hold your horses... You're beeing rate limited. You can only make 1 request per 100ms",
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
