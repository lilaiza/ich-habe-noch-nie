const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve all files from root

// In-memory storage for questions
let questions = [
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

// API Endpoints
app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.post('/api/questions', (req, res) => {
  const { question } = req.body;
  if (question && question.trim()) {
    questions.push(question.trim());
    res.json({ success: true, question: question.trim() });
  } else {
    res.status(400).json({ success: false, message: 'Ungültige Frage' });
  }
});

app.get('/api/random-question', (req, res) => {
  if (questions.length === 0) {
    res.status(404).json({ success: false, message: 'Keine Fragen verfügbar' });
  } else {
    const randomIndex = Math.floor(Math.random() * questions.length);
    res.json({ question: questions[randomIndex], index: randomIndex });
  }
});

app.delete('/api/questions/:index', (req, res) => {
  const index = parseInt(req.params.index);
  if (index >= 0 && index < questions.length) {
    questions.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Ungültiger Index' });
  }
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
