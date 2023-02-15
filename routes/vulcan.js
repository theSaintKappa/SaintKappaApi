const router = require('express').Router();
const vulcan = require('../vulcanClient');

router.get('/luckyNumber', async (req, res) => {
    try {
        const luckyNumber = await vulcan.getLuckyNumber();

        res.status(200).json({ number: luckyNumber.number !== 0 ? luckyNumber.number : null, day: luckyNumber.number !== 0 ? new Date(luckyNumber.day) : null });
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/grades', async (req, res) => {
    try {
        const grades = await vulcan.getGrades();

        res.status(200).json(grades);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/lessons', async (req, res) => {
    try {
        const lessons = await vulcan.getLessons(req.query.dateFrom, req.query.dateTo);

        res.status(200).json(lessons);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/changedLessons', async (req, res) => {
    try {
        const changedLessons = await vulcan.getChangedLessons(req.query.dateFrom, req.query.dateTo);

        res.status(200).json(changedLessons);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

module.exports = router;
