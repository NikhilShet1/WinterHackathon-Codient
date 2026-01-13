import { db } from "./firebase";
import { analyzeStudent } from "./gemini";
import { StudentRecord } from "./types";

export async function saveStudent(
  registerNumber: string,
  attendance: number,
  sleepHours: number
) {
  const risk = await analyzeStudent({ attendance, sleepHours });

  const record: StudentRecord = {
    registerNumber,
    attendance,
    sleepHours,
    riskStatus: risk === "At Risk" ? "At Risk" : "Normal",
    updatedAt: Date.now()
  };

  await db.collection("students").doc(registerNumber).set(record);
  return record;
}

export async function getAllStudents() {
  const snap = await db.collection("students").get();
  return snap.docs.map(d => d.data());
}
