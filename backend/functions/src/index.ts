import * as functions from "firebase-functions";
import * as cors from "cors";
import { saveStudent, getAllStudents } from "./students";
import { getTrends } from "./analytics";

const corsHandler = cors({ origin: true });

export const addStudent = functions.https.onRequest((req, res) =>
  corsHandler(req, res, async () => {
    const { registerNumber, attendance, sleepHours } = req.body;
    const result = await saveStudent(registerNumber, attendance, sleepHours);
    res.json(result);
  })
);

export const fetchStudents = functions.https.onRequest((req, res) =>
  corsHandler(req, res, async () => {
    res.json(await getAllStudents());
  })
);

export const fetchTrends = functions.https.onRequest((req, res) =>
  corsHandler(req, res, async () => {
    res.json(await getTrends());
  })
);
