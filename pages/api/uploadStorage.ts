import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import formidable, { File, Files } from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const uploadDir = path.join(process.cwd(), 'storage')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
  })

  form.parse(req, (err, fields, files: Files) => {
    if (err) {
      console.error('❌ Error parsing file:', err)
      return res.status(500).json({ message: 'Upload error' })
    }

    const uploaded = files['storage']
    const uploadedFile = Array.isArray(uploaded) ? uploaded[0] : uploaded

    if (!uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const finalPath = path.join(uploadDir, 'storageState.json')
    fs.renameSync(uploadedFile.filepath, finalPath)

    console.log('✅ Archivo guardado en:', finalPath)
    res.status(200).json({ message: 'Upload successful' })
  })
}
