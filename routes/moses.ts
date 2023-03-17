import express from 'express';
const router = express.Router();
import quotesSchema from '../models/moses-quotes-schema.js';
import picsSchema from '../models/moses-pics-schema.js';

router.get('/', async (req, res) => res.status(301).redirect('https://discord.com/invite/cHs56zgFBy'));

const excludeFields = { $project: { _id: 0, __v: 0 } };

router.get('/quotes', async (req, res) => {
    let aggregateQuery = [];
    if (req.query.quoteId) aggregateQuery.push({ $match: { quoteId: parseInt(req.query.quoteId.toString()) } });
    if (req.query.sort) aggregateQuery.push({ $sort: { quoteId: req.query.sort === 'asc' ? 1 : -1 } });
    if (req.query.limit) aggregateQuery.push({ $limit: parseInt(req.query.limit.toString()) });

    try {
        const quotes = await quotesSchema.aggregate([excludeFields, { $sample: { size: await quotesSchema.estimatedDocumentCount() } }, ...aggregateQuery]);
        res.status(200).json(quotes);
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
});

router.get('/quotes/random', async (req, res) => {
    try {
        const randomQuote = await quotesSchema.aggregate([excludeFields, { $sample: { size: 1 } }]);

        res.status(200).json(randomQuote[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
});

router.get('/pics', async (req, res) => {
    let aggregateQuery = [];
    if (req.query.limit) aggregateQuery.push({ $limit: parseInt(req.query.limit.toString()) });

    try {
        const pics = await picsSchema.aggregate([excludeFields, { $sample: { size: await picsSchema.estimatedDocumentCount() } }, ...aggregateQuery]);

        res.status(200).json(pics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
});

router.get('/pics/random', async (req, res) => {
    try {
        const pic = await picsSchema.aggregate([{ $project: { url: 1, _id: 0 } }, { $sample: { size: 1 } }]);

        res.status(302).redirect(pic[0].url);
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
});

export default router;
