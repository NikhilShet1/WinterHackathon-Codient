const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.analyzeStudentTrend = functions.https.onRequest(async (req, res) => {
  try {
    const { studentData } = req.body;

    const prompt = `
Analyze the following student data and identify silent distress signals.

${JSON.stringify(studentData, null, 2)}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
        functions.config().gemini.key,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

