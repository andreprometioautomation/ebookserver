// utils/saveBook.ts
import fs from 'fs';
import path from 'path';

const BOOKS_FILE = path.join(process.cwd(), 'public/pdfs/books.json');

export function saveBook(asin: string) {
  let books: string[] = [];
  if (fs.existsSync(BOOKS_FILE)) {
    books = JSON.parse(fs.readFileSync(BOOKS_FILE, 'utf8'));
  }

  if (!books.includes(asin)) {
    books.push(asin);
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books));
  }
}
