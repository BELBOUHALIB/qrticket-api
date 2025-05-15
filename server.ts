import express from 'express';
import cors from 'cors';
import * as mysql from 'mysql2/promise';
import * as path from 'path';
import * as fs from 'fs';
import * as QRCode from 'qrcode';
import { generateTicketPDF } from './utils/ticketPDF.js';
import { v4 as uuidv4 } from 'uuid';


const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'u845174030_qrticketadmin',
  password: 'Amine@@@1991',
  database: 'u845174030_qrticketpro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ensure tickets directory exists
const ticketsDir = path.join(__dirname, 'tickets');
if (!fs.existsSync(ticketsDir)) {
  fs.mkdirSync(ticketsDir);
}

app.post('/api/generate-ticket', async (req: express.Request, res: express.Response) => {
  try {
    const ticketId = `${uuidv4()}-${Date.now()}`;
    const validationUrl = `https://www.qrticketpro.com/validate.php?id=${ticketId}`;
    
    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(validationUrl, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 300
    });

    // Generate PDF
    const ticket = {
      ...req.body,
      id: ticketId,
      qrCode: qrCodeDataUrl
    };

    const pdf = await generateTicketPDF(ticket);
    const pdfPath = path.join(ticketsDir, `ticket-${ticketId}.pdf`);
    
    // Save PDF
    pdf.save(pdfPath);

    // Insert ticket ID into database
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        'INSERT INTO tickets (ticket_id, status) VALUES (?, ?)',
        [ticketId, 'unused']
      );
      
      // Send PDF file
      res.download(pdfPath, `ticket-${ticketId}.pdf`, (err: Error) => {
        // Clean up PDF file after sending
        fs.unlink(pdfPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting PDF:', unlinkErr);
          }
        });
        
        if (err) {
          console.error('Error sending PDF:', err);
        }
      });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Database error' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).json({ error: 'Error generating ticket' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});