import express from 'express';
const router = express.Router();
import Jimp from 'jimp';

router.post('/', async (req, res) => {
    if (!req.body?.url) return res.status(400).json({ code: 400, message: 'Provide an image URL' });

    try {
        const image = await Jimp.read(req.body.url);
        const overlay = await Jimp.read('./public/overlay.png');

        image.cover(1024, 1024);
        image.brightness(-0.25);
        image.contrast(0.15);
        image.composite(overlay, 0, 0);
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) {
                console.error(err);
                res.status(500).json({ code: 500, message: 'Error converting image to buffer' });
            }

            res.set('Content-Type', Jimp.MIME_PNG);
            res.send(buffer);
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: 'Error processing image' });
    }
});

export default router;
