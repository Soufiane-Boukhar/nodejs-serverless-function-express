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
    throw err;
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
    const { address, ville, quartier, type_bien, n_foncier, S_totale, S_habitable, chambres, sallesDeBains, etageAppartement, nom, prenom, telephone, email } = req.body;

    const sqlInsert = 'INSERT INTO property (ville, quartier, adresse, type_bien, n_foncier, S_totale, S_habitable, chambres, sallesDeBains, etageAppartement, nom, prenom, telephone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [ville, quartier, address.adresse, type_bien, n_foncier, S_totale, S_habitable, chambres, sallesDeBains, etageAppartement, nom, prenom, telephone, email];

    db.query(sqlInsert, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into property table:', err);
        return res.status(500).json({ error: `An error occurred while inserting data into property table: ${err.message}` });
      }

      console.log('Data inserted successfully into property table.');
      res.status(200).send('Data inserted successfully into property table.');
    });
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
