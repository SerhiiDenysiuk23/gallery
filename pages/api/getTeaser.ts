import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    responseLimit: false,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const videoPath = path.resolve('./public/media/teaser 2024/teaser.mov');

    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const videoStream = fs.createReadStream(videoPath);

    res.setHeader('Content-Length', fileSize);
    res.setHeader('Content-Type', 'video/quicktime');

    videoStream.pipe(res);
  } catch (error) {
    console.error('Failed to send video:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}