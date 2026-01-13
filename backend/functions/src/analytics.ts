import { db } from "./firebase";

export async function getTrends() {
  const snap = await db.collection("students").get();

  let atRisk = 0;
  let normal = 0;

  snap.forEach(doc => {
    doc.data().riskStatus === "At Risk" ? atRisk++ : normal++;
  });

  return { atRisk, normal };
}
