
import fs from 'fs';
import path from 'path';

const filePath = path.join('dist', 'server.js');
let content = fs.readFileSync(filePath, 'utf-8');

content = content.replace(
  `from './utils/ticketPDF'`,
  `from './utils/ticketPDF.js'`
);

fs.writeFileSync(filePath, content);
console.log('✅ Import path in dist/server.js fixed.');
