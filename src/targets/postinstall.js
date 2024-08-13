import fs from 'fs';
import path from 'path';

import { dependencyKinds } from '../constants/npm-dependency-kinds.js';
import { getPackageJson } from '../shared/get-package-json.js';
import { getWorkspaceInfo } from '../shared/get-workspace-info.js';

export default function postinstall(cwd) {
  const {workspaceInfo, workspaceRoot} = getWorkspaceInfo(cwd);
  const {
    packageJsonPath,
    packageJson: temporaryPackageJson,
    temporaryPackageJsonPath
  } = getPackageJson(cwd, true);

  if (temporaryPackageJson === null) {
    process.exit(0);
  }

  symlinkLocalPackages(
    cwd,
    workspaceInfo,
    temporaryPackageJson,
    workspaceRoot);

  resetTemporaryCopy(packageJsonPath, temporaryPackageJsonPath);
}

function symlinkLocalPackages(cwd, workspaceInfo, packageJson, workspaceRoot) {
  for (const workspaceName of Object.keys(workspaceInfo)) {
    for (const dependencyKind of dependencyKinds) {
      if (!packageJson || !packageJson[dependencyKind] || !packageJson[dependencyKind][workspaceName]) {
        continue;
      }

      console.log('Linking local package ' + workspaceName + ' to ' + packageJson.name);
      const targetPath = path.join(cwd, 'node_modules', ...workspaceName.split('/'));
      if (fs.existsSync(targetPath)) {
        fs.unlinkSync(targetPath);
      }

      fs.mkdirSync(path.dirname(targetPath), {
        recursive: true
      });

      fs.symlinkSync(
        path.join(workspaceRoot, workspaceInfo[workspaceName].location),
        targetPath,
        'dir');
    }
  }
}

function resetTemporaryCopy(packageJsonPath, temporaryPackageJsonPath) {
  fs.copyFileSync(
    path.join(temporaryPackageJsonPath),
    path.join(packageJsonPath));
  fs.unlinkSync(path.join(temporaryPackageJsonPath))
}


