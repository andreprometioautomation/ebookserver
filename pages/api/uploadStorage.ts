import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import formidable, { File } from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const form = new formidable.IncomingForm()
  const uploadDir = path.join(process.cwd(), 'storage')

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  form.uploadDir = uploadDir
  form.keepExtensions = true

  form.parse(req, (err, fields, files: { [key: string]: File | File[] }) => {
    if (err) {
      console.error('Error al subir:', err)
      return res.status(500).json({ message: 'Error al procesar el archivo' })
    }

    const uploaded = files['storage']
    const uploadedFile = Array.isArray(uploaded) ? uploaded[0] : uploaded

    if (!uploadedFile) {
      return res.status(400).json({ message: 'Archivo "storage" no encontrado' })
    }

    const finalPath = path.join(uploadDir, 'storageState.json')
    fs.renameSync(uploadedFile.filepath, finalPath)

    console.log('✅ Archivo guardado en:', finalPath)
    res.status(200).json({ message: 'Subida exitosa' })
  })
}
