import fs from 'fs';
import path from 'path';

export function readPackageJSON(dir) {
  const file = path.join(dir, 'package.json');
  if (fs.existsSync(file)) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return null;
}