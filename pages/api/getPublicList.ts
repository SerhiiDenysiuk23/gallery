import fs from 'fs';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from "next";

const regexStr = /(\d+)\s*[A-Z]\.(\w+)/i

function groupItems(list: string[]): string[][] {
  const result: string[][] = []
  const map: { [key: string]: number } = {}

  for (let i = 0; i < list.length; i++){
    const match = list[i].match(regexStr);
    const subItems = list[i].split(' ')
    const key = subItems[0]

    if (map[key] !== undefined) {
      if (match) {
        result[map[key]].push(list[i])
      }
    } else {
      map[key] = result.length
      result.push([list[i]])
    }
  }

  return result
}

function compareFn(a: string, b: string) {
  const matchA = a.match(/\d+/);
  const matchB = b.match(/\d+/);
  const numA = matchA ? parseInt(matchA[0]) : 0;
  const numB = matchB ? parseInt(matchB[0]) : 0;
  return numA - numB;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const directoryPath = path.join(process.cwd(), 'public/media');
  try {
    const files = fs.readdirSync(directoryPath);
    // Фильтруем файлы, оставляя только видео и фотографии
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.mkv'].includes(ext);
    });

    mediaFiles.sort(compareFn)
    return res.status(200).json({ files: groupItems(mediaFiles) });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}