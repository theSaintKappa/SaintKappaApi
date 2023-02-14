const app = require('express')();
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

    app.use('/', root);
    app.use('/moses', moses);
    app.use('/vulcan', vulcan);
    app.use('/railwayWebhook', railwayWebhook);
})();

app.listen(process.env.PORT || 5000, () => console.log('Server is running'));
