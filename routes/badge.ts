import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';

router.get('/:userName', async (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    try {
        const response = await fetch(`https://api.github.com/users/${req.params.userName}/events`);
        const data = (await response.json()) as object[];

        const pushEvent: any = data.find((event: any) => event.type === 'PushEvent' && event.repo.name.split('/')[1] !== req.params.userName);

        const badge = `
        <svg fill="none" xmlns="http://www.w3.org/2000/svg">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              <span>I was last seen working on <a href="https://github.com/${pushEvent?.repo.name}" target="_blank">${pushEvent?.repo.name.split('/')[1]}</a></span>
            </div>
          </foreignObject>
        </svg>`;

        res.send(badge);
    } catch (err) {
        res.send(`<svg fill="none" xmlns="http://www.w3.org/2000/svg"></svg>`);
    }
});

export default router;
