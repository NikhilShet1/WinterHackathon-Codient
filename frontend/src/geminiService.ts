
import { GoogleGenAI } from "@google/genai";
import { StudentData } from "./types";

export const analyzeStudentTrend = async (studentData: StudentData[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-pro-preview";

  const dataContext = studentData.map(d => 
    `Date: ${d.date}, Status: ${d.attendanceStatus}, Stress: ${d.stressLevel}, Sleep: ${d.sleepHours}, Mood: ${d.moodScore}`
  ).join("\n");

  const prompt = `
    Act as an academic mentor and behavioral analyst. 
    Analyze the following student data trends to identify "Silent Signals" of distress.
    
    Student History:
    ${dataContext}

    Please provide:
    1. A concise risk summary based on the correlation between attendance patterns and sleep quality.
    2. Specific behavioral anomalies (e.g., "Late arrival coinciding with reduced sleep").
    3. Actionable recommendation for support focused on reintegration and routine.
    
    Format the response in clean markdown. Keep it professional and empathetic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating AI analysis. Please check behavioral logs manually.";
  }
};
