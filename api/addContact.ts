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
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { nom_complete, tel, email, sujet, message } = req.body;

    if (!nom_complete || !tel || !email || !sujet || !message) {
      console.error('One or more required fields are null.');
      return res.status(400).send('One or more required fields are null.');
    }

    const sqlInsert = 'INSERT INTO contacts (full_name, tel, email, subject, message) VALUES (?, ?, ?, ?, ?)';

    db.query(sqlInsert, [nom_complete, tel, email, sujet, message], (err, result) => {
      if (err) {
        console.error('Error inserting data into contacts table:', err);
        return res.status(500).send('An error occurred while inserting data into contacts table.');
      }

      console.log('Data inserted successfully into contacts table.');
      res.status(200).send('Data inserted successfully into contacts table.');
    });
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).send('Internal Server Error');
  }
}
