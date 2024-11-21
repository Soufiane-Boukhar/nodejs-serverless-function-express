import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql';

const db = mysql.createConnection({
  host: '',
  port: ,
  user: '',
  password: '',
  database: '',
  ssl: {
    rejectUnauthorized: false
  },
  connectTimeout: 10000 
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('MySQL connected...');
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const sqlSelect = 'SELECT * FROM services';

    db.query(sqlSelect, (err, results) => {
      if (err) {
        console.error('Error executing SELECT query:', err);
        res.status(500).json({ error: 'Database query error', details: err.message });
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ contacts: results });
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
