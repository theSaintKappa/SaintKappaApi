import express from 'express';
const router = express.Router();
import * as path from 'path';

router.get('/', async (req, res) => res.sendFile(path.join(path.resolve(), 'index.html')));

export default router;
