// pages/api/checkLogin.ts
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

const STORAGE_PATH = path.join(process.cwd(), 'storageState.json')

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests allowed' })
  }

  try {
    const exists = fs.existsSync(STORAGE_PATH)
    res.status(200).json({ logged: exists })
  } catch (e) {
    console.error('Error checking storageState:', e)
    res.status(500).json({ logged: false, message: 'Internal error' })
  }
}
