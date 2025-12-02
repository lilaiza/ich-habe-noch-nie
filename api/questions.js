// Vercel Serverless Function for questions API
// Using Upstash Redis for persistent storage

import { Redis } from '@upstash/redis';

let redis;
try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
} catch (error) {
  console.error('Redis initialization error:', error);
}

const QUESTIONS_KEY = 'game_questions';

// Default questions
const defaultQuestions = [
  "Ich habe noch nie bei Siemens gearbeitet",
  "Ich habe noch nie an einer Weihnachtsfeier teilgenommen",
  "Ich habe noch nie Glühwein getrunken",
  "Ich habe noch nie einen Lebkuchen selbst gebacken",
  "Ich habe noch nie im Schnee gespielt",
  "Ich habe noch nie ein Weihnachtslied gesungen",
  "Ich habe noch nie einen Weihnachtsmarkt besucht",
  "Ich habe noch nie den Weihnachtsmann gesehen",
  "Ich habe noch nie einen Adventskalender gehabt",
  "Ich habe noch nie an Heiligabend gearbeitet",
  "Ich habe noch nie ein Geschenk vergessen zu kaufen",
  "Ich habe noch nie Plätzchen gebacken",
  "Ich habe noch nie eine Schneeflocke auf meiner Zunge gefangen",
  "Ich habe noch nie einen Tannenbaum geschmückt",
  "Ich habe noch nie Silvester durchgefeiert",
  "Ich habe noch nie ein Wichtelgeschenk bekommen",
  "Ich habe noch nie eine Weihnachtsgans gegessen",
  "Ich habe noch nie Schlittschuh gelaufen",
  "Ich habe noch nie einen Schneemann gebaut",
  "Ich habe noch nie 'Stille Nacht' gesungen",
  "Ich habe noch nie ein Geschenk zurückgegeben",
  "Ich habe noch nie im Winter gebadet",
  "Ich habe noch nie eine Schneeballschlacht gemacht",
  "Ich habe noch nie Glühwein selbst gemacht",
  "Ich habe noch nie an einem Silvester-Feuerwerk teilgenommen",
  "Ich habe noch nie eine Weihnachtskarte verschickt",
  "Ich habe noch nie einen Weihnachtsfilm geweint",
  "Ich habe noch nie Ski gefahren",
  "Ich habe noch nie an einem Betriebsausflug teilgenommen",
  "Ich habe noch nie eine E-Mail an den falschen Empfänger geschickt",
  "Ich habe noch nie im Meeting eingeschlafen",
  "Ich habe noch nie meinen Kaffee über die Tastatur verschüttet",
  "Ich habe noch nie eine Deadline verpasst",
  "Ich habe noch nie bei der Arbeit gelogen",
  "Ich habe noch nie einen Kollegen mit dem falschen Namen angesprochen",
  "Ich habe noch nie im Homeoffice in Pyjamahose gearbeitet",
  "Ich habe noch nie mein Passwort vergessen",
  "Ich habe noch nie bei einer Videokonferenz das Mikrofon vergessen auszuschalten"
];

async function getQuestions() {
  try {
    if (redis) {
      let questions = await redis.get(QUESTIONS_KEY);
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        // Initialize with default questions
        await redis.set(QUESTIONS_KEY, defaultQuestions);
        questions = defaultQuestions;
      }
      return questions;
    }
  } catch (error) {
    console.error('Redis Error:', error);
  }
  // Fallback to default questions if Redis is not available
  return defaultQuestions;
}

async function saveQuestions(questions) {
  try {
    if (redis) {
      await redis.set(QUESTIONS_KEY, questions);
      return true;
    }
  } catch (error) {
    console.error('Redis Save Error:', error);
  }
  return false;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const questions = await getQuestions();

    // GET all questions
    if (req.method === 'GET') {
      res.status(200).json(questions);
      return;
    }

    // POST new question
    if (req.method === 'POST') {
      const { question } = req.body;
      if (question && question.trim()) {
        questions.push(question.trim());
        const saved = await saveQuestions(questions);
        if (saved) {
          res.status(200).json({ success: true, question: question.trim() });
        } else {
          res.status(500).json({ success: false, message: 'Fehler beim Speichern' });
        }
      } else {
        res.status(400).json({ success: false, message: 'Ungültige Frage' });
      }
      return;
    }

    // DELETE question
    if (req.method === 'DELETE') {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathParts = url.pathname.split('/');
      const index = parseInt(pathParts[pathParts.length - 1]);
      
      if (index >= 0 && index < questions.length) {
        questions.splice(index, 1);
        const saved = await saveQuestions(questions);
        if (saved) {
          res.status(200).json({ success: true });
        } else {
          res.status(500).json({ success: false, message: 'Fehler beim Speichern' });
        }
      } else {
        res.status(400).json({ success: false, message: 'Ungültiger Index' });
      }
      return;
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Handler Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}
