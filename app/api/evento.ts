import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Fields, Files } from 'formidable';
import path from 'path';
import fs from 'fs';
import EventoDAO from '../../../MyEvent-Backend/DAO/evento';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      uploadDir: path.join(process.cwd(), '/public/uploads'),
      keepExtensions: true,
      multiples: true,
    });

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Error al procesar archivos.' });
      }
      try {
        // Procesar imagen y recurso PDF
        let url_imagen = null;
        let url_recurso = null;
        if (files.url_imagen) {
          const imgFile = Array.isArray(files.url_imagen) ? files.url_imagen[0] : files.url_imagen;
          url_imagen = '/uploads/' + path.basename(imgFile.filepath);
        }
        if (files.url_recurso) {
          const pdfFile = Array.isArray(files.url_recurso) ? files.url_recurso[0] : files.url_recurso;
          url_recurso = '/uploads/' + path.basename(pdfFile.filepath);
        }
        // Guardar evento en la base de datos
        const evento = await EventoDAO.create({
          titulo: fields.titulo?.toString(),
          descripcion_corta: fields.descripcion_corta?.toString(),
          descripcion_larga: fields.descripcion_larga?.toString(),
          fecha_evento: fields.fecha_evento?.toString(),
          hora: fields.hora?.toString(),
          tipo_evento: fields.tipo_evento?.toString(),
          ubicacion: fields.ubicacion?.toString(),
          latitud: fields.latitud?.toString(),
          longitud: fields.longitud?.toString(),
          ciudad: fields.ciudad?.toString(),
          distrito: fields.distrito?.toString(),
          url_direccion: fields.url_direccion?.toString(),
          url_imagen,
          url_recurso,
          estado_evento: true,
          categoria_id: fields.categoria_id ? Number(fields.categoria_id) : null,
        });
        return res.status(201).json({ success: true, evento });
      } catch (error) {
        return res.status(500).json({ success: false, error: 'Error al guardar evento.' });
      }
    });
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido.' });
  }
}

export default handler;
