import fs from 'fs';
import path from 'path';

export function getPackageJson(cwd, readTemporary = false) {
  let packageJson = null;
  const packageJsonPath = path.join(
    cwd, 'package.json'
  );
  const temporaryPackageJsonPath = `${packageJsonPath}.tmp`;

  const result = () => ({
    packageJsonPath,
    temporaryPackageJsonPath,
    packageJson
  });

  if (!fs.existsSync(
    readTemporary
      ? temporaryPackageJsonPath
      : packageJsonPath)) {
    return result();
  }

  packageJson = JSON.parse(fs
    .readFileSync(
      readTemporary
        ? temporaryPackageJsonPath
        : packageJsonPath)
    .toString());

  return result();
}
