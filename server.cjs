const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve all files from root

// In-memory storage for questions
let questions = [
  // Kommunikation & Teamarbeit
  "Ich habe schon einmal Abkürzungen verwendet, ohne zu prüfen, ob neue Kollegen sie verstehen.",
  "Ich habe schon einmal gedacht: 'Das weiß doch jeder', und dabei vergessen, dass jemand neu im Team ist.",
  "Ich habe schon einmal eine Erklärung weggelassen, weil ich davon ausgegangen bin, dass alle Bescheid wissen.",
  "Ich habe schon einmal eine Info zurückgehalten, obwohl sie jemandem geholfen hätte.",
  "Ich habe schon einmal gedacht: 'Das ist nicht mein Thema', und die Info nicht geteilt.",
  "Ich habe schon einmal bewusst nichts gesagt, obwohl ich wusste, dass es relevant ist.",
  "Ich habe schon einmal länger diskutiert, ob ich eine Aufgabe machen soll, als die Aufgabe selbst gedauert hätte.",
  "Ich habe schon einmal eine Erklärung gesucht, bevor ich das Feedback verstanden habe.",
  "Ich habe schon einmal gedacht: 'Das stimmt nicht', ohne das Feedback zu reflektieren.",
  "Ich habe schon einmal Feedback sofort gerechtfertigt, ohne zuzuhören.",
  "Ich habe schon einmal mehr Energie in die Schuldfrage gesteckt als in die Problemlösung.",
  "Ich habe schon einmal gedacht: 'Wer hat das verbockt?', bevor ich nach einer Lösung gesucht habe.",
  "Ich habe schon einmal über eine andere Abteilung gelästert.",
  "Ich habe schon einmal die Arbeit einer anderen Abteilung kleingeredet.",
  "Ich habe schon einmal gedacht: 'Die machen doch nichts Wichtiges', ohne ihre Arbeit zu kennen.",
  "Ich habe schon einmal einen Kollegen wegen eines kleinen Fehlers angemault, obwohl mir der Fehler auch hätte passieren können.",
  "Ich habe schon einmal gedacht: 'Das ist doch selbstverständlich', und dabei unfair reagiert.",
  "Ich habe schon einmal eine Frage gestellt, die ich mit wenig Aufwand selbst hätte beantworten können.",
  "Ich habe schon einmal eine Rückfrage ignoriert, weil ich dachte, die Person findet es selbst heraus.",
  "Ich habe schon einmal eine Abstimmung nicht initiiert, obwohl ich wusste, dass sie nötig ist.",
  "Ich habe schon einmal eine Verbesserungsidee zurückgehalten, weil ich dachte: 'Das bringt eh nichts.'",
  "Ich habe schon einmal eine Excel-Liste genutzt, obwohl es ein besseres Tool gab.",
  "Ich habe schon einmal eine Info nur lokal gespeichert, statt sie für alle zugänglich zu machen.",
  "Ich habe schon einmal gedacht: 'Das steht bestimmt irgendwo, aber ich finde es nicht.'",
  "Ich habe schon einmal eine Gelegenheit zur Zusammenarbeit nicht genutzt, weil ich dachte, es dauert zu lange.",
  "Ich habe schon einmal einen Kollegen unterbrochen, statt ihn ausreden zu lassen.",
  "Ich habe schon einmal in einer stressigen Situation ungeduldig oder schroff reagiert.",
  "Ich habe schon einmal vergessen, einem Kollegen Anerkennung für seine Arbeit zu geben.",
  "Ich habe schon einmal eine andere Meinung abgewertet, weil ich nicht zugestimmt habe.",
  "Ich habe schon einmal einen Fehler eines Kollegen kommentiert, statt Hilfe anzubieten.",
  "Ich habe schon einmal einen Konflikt nicht direkt angesprochen, sondern darüber gelästert.",
  "Ich habe schon einmal eine wichtige Info über Umwege gesucht und gefunden.",
  "Ich habe schon einmal gedacht: 'Ich hätte das früher ansprechen sollen.'",
  "Ich habe schon einmal eine E-Mail an alle geschickt, obwohl ich wusste, dass nur wenige betroffen sind.",
  "Ich habe schon einmal vergessen, eine Rückmeldung zu geben, die für andere wichtig war.",
  "Ich habe schon einmal an einem Projekt gearbeitet, ohne vorher die Rollen aktiv geklärt zu haben.",
  "Ich habe schon einmal doppelte Arbeit gemacht, weil ich mich nicht abgestimmt habe.",
  "Ich habe schon einmal gedacht: 'Ich könnte den Prozess einfacher gestalten.'",
  "Ich habe schon einmal eine Deadline verpasst, weil ich nicht rechtzeitig Input eingefordert habe.",
  "Ich habe schon einmal ein Tool genutzt, ohne mich vorher über die Funktionen zu informieren.",
  "Ich habe schon einmal erlebt, dass ich meine Ziele nicht klar kommuniziert habe und dadurch Missverständnisse entstanden sind.",
  "Ich habe schon einmal gedacht: 'Ich sollte dem anderen Team besser erklären, was wir tun.'",
  "Ich habe schon einmal eine Entscheidung infrage gestellt, ohne vorher den Hintergrund aktiv zu erfragen.",
  "Ich habe schon einmal vergessen, Feedback einzuholen, um mich zu verbessern.",
  "Ich habe schon einmal gedacht: 'Ich hätte aus dem letzten Projekt mehr lernen können, wenn ich nachgefragt hätte.'",
  // Weihnachten & Arbeit
  "Ich habe schon mal an Heiligabend gearbeitet.",
  "Ich habe schon mal vergessen, ein Geschenk zu kaufen.",
  "Ich habe schon mal Silvester durchgefeiert.",
  "Ich habe schon mal ein Geschenk zurückgegeben.",
  "Ich habe schon mal eine Schneeballschlacht gemacht.",
  "Ich habe schon mal eine E-Mail an den falschen Empfänger geschickt.",
  "Ich habe schon mal im Meeting geschlafen.",
  "Ich habe schon mal meinen Kaffee über die Tastatur verschüttet.",
  "Ich habe schon mal eine Deadline verpasst.",
  "Ich habe schon mal bei der Arbeit gelogen.",
  "Ich habe schon mal einen Kollegen mit dem falschen Namen angesprochen.",
  "Ich habe schon mal im Homeoffice in Pyjamahose gearbeitet.",
  "Ich habe schon mal mein Passwort vergessen.",
  "Ich habe schon mal bei einer Videokonferenz vergessen, das Mikrofon auszuschalten."
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

// Nueva ruta para delete-question (compatible con Vercel)
app.delete('/api/delete-question', (req, res) => {
  const index = parseInt(req.query.index);
  if (index >= 0 && index < questions.length) {
    questions.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Ungültiger Index' });
  }
});

// Ruta para borrar múltiples preguntas
app.delete('/api/delete-multiple', (req, res) => {
  const { indices } = req.body;
  
  if (!indices || !Array.isArray(indices) || indices.length === 0) {
    return res.status(400).json({ error: 'Invalid indices' });
  }
  
  // Sort indices in descending order to delete from end first
  const sortedIndices = [...indices].sort((a, b) => b - a);
  
  for (const index of sortedIndices) {
    if (index >= 0 && index < questions.length) {
      questions.splice(index, 1);
    }
  }
  
  res.json({ success: true, deleted: indices.length });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
