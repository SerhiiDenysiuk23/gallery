import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Получаем путь к видео
    const videoPath = path.resolve('./public/media/teaser 2024/teaser.mov');

    // Проверяем существование файла
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    // Читаем файл видео
    const videoStream = fs.createReadStream(videoPath);

    // Устанавливаем заголовки
    res.setHeader('Content-Type', 'video/quicktime');

    // Отправляем видео в ответе
    videoStream.pipe(res);
  } catch (error) {
    console.error('Failed to send video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}