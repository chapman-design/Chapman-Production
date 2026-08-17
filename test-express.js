import express from 'express';
const app = express();
try {
  app.get('*all', (req, res) => res.send('matched'));
  console.log('*all works');
} catch (e) { console.log('*all failed:', e.message); }
