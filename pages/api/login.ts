import { NextApiRequest, NextApiResponse } from 'next';
import { firefox, BrowserContext, Page } from 'playwright';
import path from 'path';

const PROFILE_PATH = path.join(process.cwd(), 'firefox-profile');

let context: BrowserContext | undefined;

async function isUserLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.goto('https://leer.amazon.com.mx/kindle-library', {
      waitUntil: 'networkidle',
    });

    // Verifica que el logo esté presente (lo que indica sesión iniciada)
    await page.waitForSelector('a#kindle-cloud-reader-logo', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}


export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    if (!context) {
      context = await firefox.launchPersistentContext(PROFILE_PATH, {
        headless: true, // ✅ Headless para producción
      });
    }

    const page = await context.newPage();

    const loggedIn = await isUserLoggedIn(page);

    if (loggedIn) {
      await page.close();
      return res.status(200).json({ message: 'Already logged in. Proceed to capture pages.' });
    } else {
      return res.status(200).json({
        message: 'Not logged in. Please log in manually (headless mode cannot proceed with login UI).',
      });
    }

  } catch (e) {
    console.error('Login check error:', e);
    if (context) {
      await context.close();
      context = undefined;
    }
    return res.status(500).json({ message: 'Error during login check process' });
  }
}
