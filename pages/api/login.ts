import { NextApiRequest, NextApiResponse } from 'next';
import { firefox, BrowserContext, Page } from 'playwright';
import path from 'path';
import fs from 'fs';

const PROFILE_PATH = path.join(process.cwd(), 'firefox-profile');

let context: BrowserContext | undefined;

async function isUserLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.goto('https://leer.amazon.com.mx/kindle-library', {
      waitUntil: 'networkidle',
    });
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
    // Ensure profile path exists
    if (!fs.existsSync(PROFILE_PATH)) {
      fs.mkdirSync(PROFILE_PATH, { recursive: true });
    }

    // Create or recover context
    if (!context) {
      context = await firefox.launchPersistentContext(PROFILE_PATH, {
        headless: true, // Change to true for prod after debugging
      });
    }

    const page = await context.newPage();
    const loggedIn = await isUserLoggedIn(page);
    await page.close();

    if (loggedIn) {
      return res.status(200).json({ message: 'Already logged in. Proceed to capture pages.' });
    } else {
      return res.status(200).json({
        message: 'Not logged in. Please log in manually (headless mode cannot proceed with login UI).',
      });
    }

  } catch (e) {
    console.error('Login check error:', e);
    if (context) {
      try {
        await context.close();
      } catch (_) {}
      context = undefined;
    }
    return res.status(500).json({ message: 'Error during login check process' });
  }
}
