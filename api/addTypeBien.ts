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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { nom, prenom, email, tel, type_de_bien, superficie, adresse, budget, message, type } = req.body;

    if (!nom || !tel || !email || !prenom || !message || !type_de_bien || !superficie || !adresse || !budget || !type ) {
      console.error('One or more required fields are null.');
      return res.status(400).send('One or more required fields are null.');
    }

    const sqlInsert = 'INSERT INTO services (nom, prenom, email, telephone, type_de_bien, addresse, budget, demande, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sqlInsert, [nom, prenom, email, tel, type_de_bien, adresse, budget, message, type], (err, result) => {
      if (err) {
        console.error('Error inserting data into services table:', err);
        return res.status(500).send(`An error occurred while inserting data into services table: ${err.message}`); // Return detailed error message
      }

      console.log('Data inserted successfully into services table.');
      res.status(200).send('Data inserted successfully into services table.');
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
