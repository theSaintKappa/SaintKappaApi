import { Keystore, AccountTools, VulcanHebe } from 'vulcan-api-js';
let client = null;

const vulcan = async () => {
    const keystore = new Keystore();
    keystore.loadFromObject({ certificate: process.env.CERTIFICATE, fingerprint: process.env.FINGERPRINT, privateKey: process.env.PRIVATEKEY, firebaseToken: process.env.FIREBASETOKEN, deviceModel: process.env.DEVICEMODEL });

    client = new VulcanHebe(keystore, AccountTools.loadFromObject({ loginId: parseInt(process.env.LOGINID), userLogin: process.env.USERLOGIN, userName: process.env.USERLOGIN, restUrl: process.env.RESTURL }));

    const students = await client.getStudents();

    await client.selectStudent();

    console.log(`Logged in as: ${students[0]?.pupil.firstName} ${students[0]?.pupil.surname}`);
};

export default {
    initialize: async () => await vulcan(),

    getClient: () => client,

    getLuckyNumber: async () => await client.getLuckyNumber(),

    getGrades: async () => await client.getGrades(),

    getLessons: async (dateFrom, dateTo) => await client.getLessons(dateFrom, dateTo),

    getChangedLessons: async (dateFrom, dateTo) => await client.getChangedLessons(dateFrom, dateTo),

    getExams: async (dateFrom, dateTo) => await client.getExams(dateFrom, dateTo),
};
