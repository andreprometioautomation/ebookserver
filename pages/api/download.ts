// pages/api/download.ts
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.query
  if (!file || Array.isArray(file)) {
    return res.status(400).end('Missing file parameter')
  }

  // Resolve against your public/output-pdfs folder
  const filePath = path.join(process.cwd(), 'public', 'output-pdfs', file)
  if (!fs.existsSync(filePath)) {
    return res.status(404).end('File not found')
  }

  // Stream it with correct headers
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${path.basename(file)}"`
  )

  const stream = fs.createReadStream(filePath)
  stream.pipe(res)

  // Once the stream finishes, delete the file
  stream.on('end', () => {
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting PDF:', err)
    })
  })
}
