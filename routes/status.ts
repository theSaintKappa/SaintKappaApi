import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';

router.get('/', async (req, res) => {
    try {
        const response = await fetch('https://api.github.com/users/theSaintKappa/events');
        const data: object[] = (await response.json()) as object[];

        const pushEvent: any = data.find((event: any) => event.type === 'PushEvent');

        res.status(200).send(`<h1 style="font-family: monospace">I was last seen working on ${pushEvent.repo.name.split('/')[1]} with message "${pushEvent.payload.commits[0].message}"</h1>`);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

export default router;
