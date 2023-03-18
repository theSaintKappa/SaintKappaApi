import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';

router.get('/:userName', async (req, res) => {
    try {
        const response = await fetch(`https://api.github.com/users/${req.params.userName}/events`);
        const data = (await response.json()) as object[];

        const pushEvent: any = data.find((event: any) => event.type === 'PushEvent' && event.repo.name.split('/')[1] !== req.params.userName);

        res.status(200).send(`<svg fill="none" xmlns="http://www.w3.org/2000/svg">I was last seen working on <a href="${pushEvent?.repo.url}" target="_blank">${pushEvent?.repo.name.split('/')[1]}</a></svg>`);
    } catch (err) {
        res.status(500).send(`<svg fill="none" xmlns="http://www.w3.org/2000/svg">Badge failed to load</svg>`);
    }
});

export default router;
