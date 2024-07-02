import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql';
import ExcelJS from 'exceljs';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Request received:', req.method);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    console.log('Handling GET request');
    const sqlSelect = 'SELECT * FROM contacts';

    db.query(sqlSelect, async (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Database query error' });
        return;
      }

      console.log('Query results:', results);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Contacts');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 20 }
      ];

      results.forEach(result => {
        worksheet.addRow(result);
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=contacts.xlsx');

      const buffer = await workbook.xlsx.writeBuffer();
      res.status(200).send(buffer);
    });
  } else {
    console.log('Handling invalid method:', req.method);
    res.setHeader('Content-Type', 'application/json');
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
