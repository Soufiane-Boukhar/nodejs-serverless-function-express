
import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'mysql-1fb82b3b-boukhar-d756.e.aivencloud.com',
  port: 20744,
  user: 'avnadmin',
  password: 'AVNS_wWoRjEZRmFF5NgjGCcY',
  database: 'defaultdb',
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

    const sqlSelect = 'SELECT * FROM contacts';

    db.query(sqlSelect, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Database query error' });
        return;
      }

      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ contacts: results });
    });
}
