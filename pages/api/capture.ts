import { NextApiRequest, NextApiResponse } from 'next';
import { firefox, BrowserContext } from 'playwright';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PDFDocument } from 'pdf-lib';

const PROFILE_PATH = path.join(process.cwd(), 'firefox-profile');
const SCREENSHOT_ROOT = path.join(process.cwd(), 'screenshots');

const MAX_PAGES = 100;

// Asegura que el directorio exista
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'output-pdfs');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Genera el PDF desde la carpeta de screenshots específica
async function createPdfFromScreenshots(requestId: string): Promise<string> {
  const sessionDir = path.join(SCREENSHOT_ROOT, requestId);

  const pdfDoc = await PDFDocument.create();
  const files = fs
    .readdirSync(sessionDir)
    .filter(file => file.endsWith('.png'))
    .sort();

  for (const file of files) {
    const filePath = path.join(sessionDir, file);
    const imageBytes = fs.readFileSync(filePath);
    const image = await pdfDoc.embedPng(imageBytes);
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputFileName = `book-${requestId}-${timestamp}.pdf`;
  const outputFilePath = path.join(OUTPUT_DIR, outputFileName);

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputFilePath, pdfBytes);
  console.log(`✅ PDF creado en ${outputFilePath}`);

  return `/output-pdfs/${outputFileName}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { asin } = req.body;
  if (!asin) {
    return res.status(400).json({ message: 'ASIN is required' });
  }

  ensureDir(SCREENSHOT_ROOT);
  ensureDir(OUTPUT_DIR);

  const requestId = uuidv4();
  const sessionDir = path.join(SCREENSHOT_ROOT, requestId);
  fs.mkdirSync(sessionDir);

  let context: BrowserContext | undefined;

  try {
    context = await firefox.launchPersistentContext(PROFILE_PATH, {
      headless: true,
    });

    const [page] = context.pages().length ? context.pages() : [await context.newPage()];

    await page.goto('https://leer.amazon.com.mx/kindle-library', { waitUntil: 'networkidle' });

    // Respuesta rápida al frontend
    res.status(200).json({ message: 'Started capturing the pages', requestId });

    await page.goto(`https://leer.amazon.com.mx/?asin=${asin}`, { waitUntil: 'networkidle' });

    let pageNum = 1;
    let lastText: string | null = null;
    let noChangeCount = 0;

    while (pageNum <= MAX_PAGES && noChangeCount < 2) {
      const filename = path.join(sessionDir, `page_${String(pageNum).padStart(2, '0')}.png`);
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`📸 Página ${pageNum} capturada`);

      const currText = await page.evaluate(() => document.body.innerText || '');

      if (currText === lastText) {
        noChangeCount += 1;
      } else {
        noChangeCount = 0;
      }

      lastText = currText;

      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(1500);
      pageNum += 1;
    }

    // ✅ Crear PDF automáticamente al finalizar las capturas
    await createPdfFromScreenshots(requestId);

  } catch (e) {
    console.error('Error durante la captura:', e);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error capturing pages' });
    }
  } finally {
    if (context) await context.close();
  }
}
