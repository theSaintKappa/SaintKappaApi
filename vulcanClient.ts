import { Keystore, AccountTools, VulcanHebe, registerAccount } from 'vulcan-api-js';
import { Account } from 'vulcan-api-js/lib/models/account.js';
import { Student } from 'vulcan-api-js/lib/models/student.js';
import { MessageBox } from 'vulcan-api-js/lib/models/messageBox.js';

let client: VulcanHebe, students: Student[], keystore: Keystore, messageBox: MessageBox, selectedStudent: Student;

const vulcan = async () => {
    keystore = new Keystore();
    keystore.loadFromObject({ certificate: process.env.CERTIFICATE, fingerprint: process.env.FINGERPRINT, privateKey: process.env.PRIVATEKEY, firebaseToken: process.env.FIREBASETOKEN, deviceModel: process.env.DEVICEMODEL });

    client = new VulcanHebe(keystore, AccountTools.loadFromObject({ loginId: parseInt(process.env.LOGINID), userLogin: process.env.USERLOGIN, userName: process.env.USERLOGIN, restUrl: process.env.RESTURL }));

    students = await client.getStudents();

    await client.selectStudent();
    console.log(`Logged in as: ${students[0]?.pupil.firstName} ${students[0]?.pupil.surname}`);

    const messageBoxes = await client.getMessageBoxes();
    messageBox = messageBoxes[0];
    console.log(`Set message box to: ${messageBox.name} (${messageBox.globalKey})`);
};

export default {
    initialize: async () => await vulcan(),

    getLuckyNumber: async () => await client.getLuckyNumber(),

    getGrades: async (lastSync: Date) => await client.getGrades(lastSync),

    getLessons: async (dateFrom: Date, dateTo: Date) => await client.getLessons(dateFrom, dateTo),

    getChangedLessons: async (dateFrom: Date, dateTo: Date) => await client.getChangedLessons(dateFrom, dateTo),

    getExams: async (lastSync: Date) => await client.getExams(lastSync),

    getMessages: async () => {
        return { messageBox, messages: await client.getMessages(messageBox.globalKey) };
    },

    getHomework: async () => await client.getHomework(),

    getAttandance: async (dateFrom: Date, dateTo: Date) => await client.getAttendance(dateFrom, dateTo),

    fetchStudents: async () => await client.getStudents(),

    getStudents: () => students,

    newAccount: async (token: string, symbol: string, pin: string) => {
        const newStudent: Account = await registerAccount(keystore, token, symbol, pin);
        students = await client.getStudents();
        return newStudent;
    },

    selectStudent: async (student: Student) => {
        await client.selectStudent(student);
        client = new VulcanHebe(keystore, AccountTools.loadFromObject({ loginId: parseInt(process.env.LOGINID), userLogin: process.env.USERLOGIN, userName: process.env.USERLOGIN, restUrl: process.env.RESTURL }));
        selectedStudent = student;
        return selectedStudent;
    },
};
