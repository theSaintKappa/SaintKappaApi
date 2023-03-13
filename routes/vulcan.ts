import vulcan from '../vulcanClient.js';
import { Student } from 'vulcan-api-js/lib/models/student.js';
import { Account } from 'vulcan-api-js/lib/models/account.js';
import { ChangedLesson } from 'vulcan-api-js/lib/models/changedLesson.js';
import { Exam } from 'vulcan-api-js/lib/models/exam.js';
import { Grade } from 'vulcan-api-js/lib/models/grade.js';
import { Lesson } from 'vulcan-api-js/lib/models/lesson.js';
import { LuckyNumber } from 'vulcan-api-js/lib/models/luckyNumber.js';
import { Homework } from 'vulcan-api-js/lib/models/homework.js';
import { Attendance } from 'vulcan-api-js/lib/models/attendance.js';
import { Message } from 'vulcan-api-js/lib/models/message.js';
import { MessageBox } from 'vulcan-api-js/lib/models/messageBox.js';
interface Messages {
    messageBox: MessageBox;
    messages: Message[];
}

import express from 'express';
const router = express.Router();

router.get('/luckyNumber', async (req, res) => {
    try {
        const luckyNumber: LuckyNumber = await vulcan.getLuckyNumber();

        res.status(200).json({ number: luckyNumber.number !== '0' ? luckyNumber.number : null, day: luckyNumber.number !== '0' ? new Date(luckyNumber.day) : null });
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/grades', async (req, res) => {
    try {
        const grades: Grade[] = await vulcan.getGrades(req.query.lastSync);

        res.status(200).json(grades);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/lessons', async (req, res) => {
    try {
        const lessons: Lesson[] = await vulcan.getLessons(req.query.dateFrom, req.query.dateTo);

        res.status(200).json(lessons);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/changedLessons', async (req, res) => {
    try {
        const changedLessons: ChangedLesson[] = await vulcan.getChangedLessons(req.query.dateFrom, req.query.dateTo);

        res.status(200).json(changedLessons);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/exams', async (req, res) => {
    try {
        const exams: Exam[] = await vulcan.getExams(req.query.lastSync);

        res.status(200).json(exams);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/messages', async (req, res) => {
    try {
        const messages: Messages = await vulcan.getMessages();

        res.status(200).json(messages);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/homework', async (req, res) => {
    try {
        const homework: Homework[] = await vulcan.getHomework();

        res.status(200).json(homework);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/attandance', async (req, res) => {
    try {
        const attendance: Attendance[] = await vulcan.getAttandance(req.query.dateFrom ?? new Date(), req.query.dateTo ?? new Date());

        res.status(200).json(attendance);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/students', async (req, res) => {
    try {
        const students: Student[] = await vulcan.fetchStudents();

        res.status(200).json(students);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/addAccount', async (req, res) => {
    try {
        const newAccount: Account = await vulcan.newAccount(req.query.token, req.query.symbol, req.query.pin);

        res.status(200).json({ newAccount, students: vulcan.getStudents() });
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

export default router;
