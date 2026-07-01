import fs from 'fs/promises';
import path from 'path';
import { kv } from '@vercel/kv';

const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.KV_REST_API_URL;

export async function readData<T>(key: string, localFilePath: string, defaultValue: T): Promise<T> {
  if (IS_PROD) {
    try {
      const data = await kv.get<T>(key);
      if (data !== null) return data;
      
      // Auto-seed: If KV is empty, try to seed it with the default local file contents if available
      const localData = await readLocalFile<T>(localFilePath, defaultValue);
      await kv.set(key, localData);
      return localData;
    } catch (error) {
      console.error(`KV read error for key "${key}", falling back to local file:`, error);
      return readLocalFile<T>(localFilePath, defaultValue);
    }
  } else {
    return readLocalFile<T>(localFilePath, defaultValue);
  }
}

export async function writeData<T>(key: string, localFilePath: string, value: T): Promise<void> {
  if (IS_PROD) {
    try {
      await kv.set(key, value);
    } catch (error) {
      console.error(`KV write error for key "${key}":`, error);
      throw error;
    }
  } else {
    await writeLocalFile<T>(localFilePath, value);
  }
}

async function readLocalFile<T>(relativeFilePath: string, defaultValue: T): Promise<T> {
  try {
    const fullPath = path.join(process.cwd(), relativeFilePath);
    const data = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return defaultValue;
  }
}

async function writeLocalFile<T>(relativeFilePath: string, value: T): Promise<void> {
  const fullPath = path.join(process.cwd(), relativeFilePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, JSON.stringify(value, null, 2), 'utf8');
}
