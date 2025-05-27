import { NextApiRequest, NextApiResponse } from 'next';
import { firefox, BrowserContext } from 'playwright';
import path from 'path';

const PROFILE_PATH = path.join(process.cwd(), 'firefox-profile');

let context: BrowserContext | undefined;

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  if (!context) {
    try {
      context = await firefox.launchPersistentContext(PROFILE_PATH, {
        headless: false,
      });

      const page = await context.newPage();
      await page.goto('https://leer.amazon.com.mx/kindle-library', { waitUntil: 'networkidle' });

      // Aquí esperamos hasta que el usuario haya iniciado sesión.
      res.status(200).json({ message: 'Login process started. Please complete login and then proceed with providing ASIN.' });

    } catch (e) {
      console.error(e);
      if (context) await context.close();
      res.status(500).json({ message: 'Error during login process' });
    }
  } else {
    res.status(200).json({ message: 'Already logged in. Proceed to capture pages.' });
  }
}