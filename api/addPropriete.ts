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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { address, ville, quartier, type_bien, n_foncier, S_totale, S_habitable, chambres, sallesDeBains, etageAppartement, nom, prenom, telephone, email, etatBien, periodeConstruction } = req.body;

    if (!address || !ville || !quartier || !type_bien || !nom || !prenom || !telephone || !email ) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sqlInsert = 'INSERT INTO property (ville, quartier, adresse, type_bien, n_foncier, S_totale, S_habitable, chambres, sallesDeBains, etageAppartement, nom, prenom, telephone, email, etatBien, periodeConstruction) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [ville, quartier, address, type_bien, n_foncier, S_totale, S_habitable, chambres, sallesDeBains, etageAppartement, nom, prenom, telephone, email, etatBien, periodeConstruction];

    try {
      await new Promise((resolve, reject) => {
        db.query(sqlInsert, values, (err, result) => {
          if (err) {
            console.error('Error inserting data into property table:', err);
            reject(err);
          } else {
            console.log('Data inserted successfully into property table.');
            resolve(result);
          }
        });
      });

      res.status(200).json({ message: 'Data inserted successfully into property table.' });
    } catch (error) {
      res.status(500).json({ error: `An error occurred while inserting data into property table: ${error.message}` });
    }
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
