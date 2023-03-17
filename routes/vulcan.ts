import express from 'express';
const router = express.Router();
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
        const grades: Grade[] = await vulcan.getGrades(new Date(req.query.lastSync?.toString() ?? 0));

        res.status(200).json(grades);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/lessons', async (req, res) => {
    try {
        let lessons: Lesson[] = await vulcan.getLessons(new Date(req.query.dateFrom?.toString() ?? Date.now()), new Date(req.query.dateTo?.toString() ?? Date.now()));
        // sort by time slot
        lessons = lessons.sort((a, b) => (a.timeSlot.position > b.timeSlot.position ? 1 : -1));

        res.status(200).json(lessons);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/changedLessons', async (req, res) => {
    try {
        let changedLessons: ChangedLesson[] = await vulcan.getChangedLessons(new Date(req.query.dateFrom?.toString() ?? Date.now()), new Date(req.query.dateTo?.toString() ?? Date.now()));

        res.status(200).json(changedLessons);
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

router.get('/exams', async (req, res) => {
    try {
        const exams: Exam[] = await vulcan.getExams(new Date(req.query.lastSync?.toString() ?? 0));

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
        let attendance: Attendance[] = await vulcan.getAttandance(new Date(req.query.dateFrom?.toString() ?? Date.now()), new Date(req.query.dateTo?.toString() ?? Date.now()));
        // sort by time slot
        attendance = attendance.sort((a, b) => (a.time.position > b.time.position ? 1 : -1));

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
        const newAccount: Account = await vulcan.newAccount(req.query.token.toString(), req.query.symbol.toString(), req.query.pin.toString());

        res.status(200).json({ newAccount, students: vulcan.getStudents() });
    } catch (err) {
        console.error(err);
        return res.status(400).send('Bad Request');
    }
});

// router.get('/selectStudent/:pupilId', async (req, res) => {
//     try {
//         const students: Student[] = await vulcan.fetchStudents();

//         if (!students.map((student: Student) => student.pupil.id.toString()).includes(req.params.pupilId)) return res.status(400).send({ code: 400, message: 'Student not found' });

//         const selectedStudent: Student = await vulcan.selectStudent(students.find((student: Student) => student.pupil.id.toString() === req.params.pupilId));

//         res.status(200).json(selectedStudent);
//     } catch (err) {
//         console.error(err);
//         return res.status(400).send('Bad Request');
//     }
// });

export default router;
