import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeStudent(data: {
  attendance: number;
  sleepHours: number;
}) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an academic risk analyzer.
If attendance < 75 or sleep < 6, mark At Risk.
Return only one word: Normal or At Risk.

Attendance: ${data.attendance}
Sleep Hours: ${data.sleepHours}
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
