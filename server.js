import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve public folder
const publicPath = path.join(__dirname, "public");
console.log("📂 Serving static files from:", publicPath);
app.use(express.static(publicPath));

// Root route -> serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// API Key from .env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Test route
app.get("/test", (req, res) => {
  res.send("✅ Server is working!");
});
app.get("/list-models", async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list models" });
  }
});

// Analyze route
// Analyze route
app.post("/analyze", async (req, res) => {
  const { code } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({ error: "No code provided" });
  }

  const systemPrompt = `
You are a beginner-friendly coding tutor.

Rules:
- DO NOT give corrected code.
- DO NOT give final solutions.
- Explain the logical mistake using simple analogies.
- Ask 3 to 5 Socratic guiding questions.
- Respond ONLY in JSON:
{
  "explanation": "string",
  "hints": ["string", "string", "string"]
}
`;

  const userPrompt = `Student's code:\n${code}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
            },
          ],
        }),
      },
    );

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error("❌ Gemini raw response:", data);
      return res.status(500).json({ error: "No response from Gemini" });
    }

    console.log("🤖 Gemini response:\n", text);

    let jsonText = text.trim();
    jsonText = jsonText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      console.error("❌ JSON parse failed. Cleaned text was:\n", jsonText);
      return res
        .status(500)
        .json({ error: "Gemini did not return valid JSON" });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "AI analysis failed" });
  }
});
// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
