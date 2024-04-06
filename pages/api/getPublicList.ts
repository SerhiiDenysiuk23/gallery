import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from "next";

const regexStr = /(\d+)\s*[A-Z]\.(\w+)/i

function groupItems(list: string[]): string[][] {

  return  list.reduce((acc: string[][], item, index ) => {
    const match = item.match(regexStr);
    const subItems = item.split(' ')


    if (match && index > 0 && list[index-1].includes(subItems[0])){

      acc[acc.length - 1].push(item)
    }
    else {
      return [...acc, [item]]
    }
    return acc
  }, [])
}



export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const directoryPath = path.join(process.cwd(), 'public/media');
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).json({ error: err });
    }
    // Фильтруем файлы, оставляя только видео и фотографии
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.mkv'].includes(ext);
    });
    return res.status(200).json({ files: groupItems(mediaFiles) });
  });
}