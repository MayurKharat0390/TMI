import fs from 'fs/promises';
import path from 'path';
import { kv } from '@vercel/kv';

// Statically import the default JSON assets so Webpack bundles them into serverless functions
import defaultTeam from '@/data/team.json';
import defaultGallery from '@/data/gallery.json';
import defaultSponsors from '@/data/sponsors.json';
import defaultSections from '@/data/forum_sections.json';

const IS_PROD = process.env.NODE_ENV === 'production' || !!process.env.KV_REST_API_URL;

// Map keys to their bundled default data to prevent EROFS/ENOENT filesystem issues on Vercel
function getDefaultData(key: string, fallbackDefault: any): any {
  switch (key) {
    case 'team_roster':
      return defaultTeam;
    case 'gallery_catalog':
      return defaultGallery;
    case 'sponsors_list':
      return defaultSponsors;
    case 'forum_sections':
      return defaultSections;
    case 'forum_posts':
      return [];
    default:
      return fallbackDefault;
  }
}

export async function readData<T>(key: string, localFilePath: string, defaultValue: T): Promise<T> {
  const staticDefault = getDefaultData(key, defaultValue) as T;

  if (IS_PROD) {
    try {
      // If KV variables are defined, fetch from KV
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const data = await kv.get<T>(key);
        if (data !== null) return data;
        
        // Auto-seed: Seed KV with the bundled default data
        await kv.set(key, staticDefault);
        return staticDefault;
      }
      
      // Fallback: If KV is not linked yet, return the bundled default data directly
      return staticDefault;
    } catch (error) {
      console.error(`KV read error for key "${key}", returning bundled default:`, error);
      return staticDefault;
    }
  } else {
    // Local Development: Read from disk so changes are persistent
    return readLocalFile<T>(localFilePath, staticDefault);
  }
}

export async function writeData<T>(key: string, localFilePath: string, value: T): Promise<void> {
  if (IS_PROD) {
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await kv.set(key, value);
      } else {
        throw new Error("Missing KV environment variables in production.");
      }
    } catch (error) {
      console.error(`KV write error for key "${key}":`, error);
      throw error;
    }
  } else {
    // Local Development: Write to disk
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
