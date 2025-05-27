import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const OUTPUT_DIR = path.join(process.cwd(), 'public/output-pdfs');

  try {
    const files = fs.readdirSync(OUTPUT_DIR).filter(file => file.endsWith('.pdf'));
    const books = files.map(filename => ({
      name: filename,
      url: `/output-pdfs/${filename}`,
    }));
    res.status(200).json(books);
  } catch (error) {
    console.error('Error listing books:', error);
    res.status(500).json({ message: 'Failed to list books' });
  }
}
