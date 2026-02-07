🧠 AI Coding Tutor

An AI-powered web app that helps beginners understand mistakes in their code using explanations and guiding questions — without giving direct solutions.

🚀 Features

Paste buggy code and get:

Simple explanation of the logical mistake

3–5 guiding questions (Socratic method)

No final code is given — encourages learning

Clean, beginner-friendly UI

Uses Google Gemini API for analysis

Runs as a Node.js + Express web app

🛠️ Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express

AI API: Google Gemini API

Others: dotenv, cors, node-fetch

<img width="408" height="313" alt="image" src="https://github.com/user-attachments/assets/152ecf48-6959-4d78-9719-6fea27ee3a24" />


🔑 Environment Variables

This project uses the Google Gemini API.

Create a .env file in the root folder:

GEMINI_API_KEY=your_api_key_here


⚠️ Do not commit your .env file to GitHub.

▶️ How to Run Locally

Clone the repository:

git clone https://github.com/your-username/ai-coding-tutor.git
cd ai-coding-tutor


Install dependencies:

npm install


Create .env file and add your API key:

GEMINI_API_KEY=your_api_key_here


Start the server:

node server.js


Open in browser:

http://localhost:3000

🔌 API Endpoint
POST /analyze

Request Body:

{
  "code": "your code here"
}


Response:

{
  "explanation": "Simple explanation of the mistake",
  "hints": [
    "Guiding question 1",
    "Guiding question 2",
    "Guiding question 3"
  ]
}

🎯 Purpose

This project is built as a learning assistant to:

Help beginners think about bugs

Avoid spoon-feeding solutions

Encourage logical problem-solving
