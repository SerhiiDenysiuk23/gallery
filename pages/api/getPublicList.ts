import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const directoryPath = path.join(process.cwd(), 'public');
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).json({ error: err });
    }
    // Фильтруем файлы, оставляя только видео и фотографии
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.mkv'].includes(ext);
    });
    return res.status(200).json({ files: mediaFiles });
  });
}