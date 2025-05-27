
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end()  // Method Not Allowed
  }

  const { email, password } = req.body
  const validEmail    = process.env.LOGIN_EMAIL
  const validPassword = process.env.LOGIN_PASSWORD

  if (!validEmail || !validPassword) {
    console.error('⚠️ LOGIN_EMAIL / LOGIN_PASSWORD not set in env!')
    return res.status(500).json({ message: 'Server mis-configured.' })
  }

  if (email === validEmail && password === validPassword) {
    // TODO: set a proper session/cookie here. For demo we just return success.
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ message: 'Invalid credentials' })
}
