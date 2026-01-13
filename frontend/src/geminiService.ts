import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeStudentTrend(studentData: any[]): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const context = studentData
    .map(
      (d) =>
        `Date: ${d.date}, Attendance: ${d.attendanceStatus}, Stress: ${d.stressLevel}, Sleep: ${d.sleepHours}`
    )
    .join("\n");

  const prompt = `
You are an academic mentor and behavioral analyst.

Analyze the following student data to detect early warning signs ("Silent Signals") of distress.

Student history:
${context}

Give:
1. Risk summary
2. Behavioral anomalies
3. Clear recommendations
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
