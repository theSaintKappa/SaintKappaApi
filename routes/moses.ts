import express from 'express';
const router = express.Router();

import fetch from 'node-fetch';

import quotesSchema from '../models/moses-quotes-schema.js';
import picsSchema from '../models/moses-pics-schema.js';

router.get('/', async (req, res) => {
    try {
        res.status(301).redirect('https://discord.com/invite/cHs56zgFBy');
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

// ?quoteId=1&sort=asc&limit=1
router.get('/quotes', async (req, res) => {
    const quoteIdQ = req.query.quoteId ?? null;
    if (quoteIdQ < 1 && quoteIdQ !== null) return res.status(400).json({ status: 400, message: 'quoteId should be greater than 0' });

    const sortQ = req.query.sort ?? null;
    if (!['asc', 'desc'].includes(sortQ) && sortQ !== null) return res.status(400).json({ status: 400, message: 'sort only accepts "asc" or "desc"' });
    const sort = {
        asc: '1',
        desc: '-1',
    };

    const limitQ = req.query.limit ?? null;
    if (limitQ < 1 && limitQ !== null) return res.status(400).json({ status: 400, message: 'limit should be greater than 0' });

    try {
        const quotes = await quotesSchema
            .find(quoteIdQ ? { quoteId: parseInt(quoteIdQ) } : {})
            .sort({ quoteId: sortQ ? parseInt(sort[sortQ]) : 1 })
            .limit(limitQ);

        res.status(200).json({ query: { quoteId: quoteIdQ, sort: sortQ, limit: limitQ }, content: quotes });
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/quotes/random', async (req, res) => {
    try {
        const randomQuote = await quotesSchema.aggregate([{ $sample: { size: 1 } }]);

        res.status(200).json(randomQuote[0]);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/pics', async (req, res) => {
    try {
        const pics = await picsSchema.find({}).limit(req.query.limit ?? null);

        res.status(200).json(pics);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/pics/random', async (req, res) => {
    try {
        const pic = await picsSchema.aggregate([{ $sample: { size: 1 } }]);

        if (req.query.json === 'true') return res.status(200).json(pic[0]);

        const response = await fetch(pic[0].url);

        res.setHeader('Content-Type', response.headers.get('content-type'));
        res.setHeader('Content-Length', response.headers.get('content-length'));
        res.setHeader('Cache-Control', 'public, max-age=10');
        res.status(200);
        response.body.pipe(res);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

export default router;
