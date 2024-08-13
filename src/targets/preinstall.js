import fs from 'fs';
import path from 'path';

import { dependencyKinds } from '../constants/npm-dependency-kinds.js';
import { getPackageJson } from '../shared/get-package-json.js';
import { getWorkspaceInfo } from '../shared/get-workspace-info.js';

export default function preinstall(cwd) {
  const {workspaceInfo} = getWorkspaceInfo(cwd);
  const {
    packageJsonPath,
    packageJson,
    temporaryPackageJsonPath
  } = getPackageJson(cwd);

  if (fs.existsSync(path.join(temporaryPackageJsonPath))) {
    process.exit(0);
  }

  if (packageJson === null) {
    throw new Error('package.json not found for package ' + cwd);
  }

  createTemporaryCopy(packageJsonPath, temporaryPackageJsonPath);
  createPackageJsonWithoutWorkspaceDependencies(workspaceInfo, packageJson, packageJsonPath);
}

function createPackageJsonWithoutWorkspaceDependencies(workspaceInfo, packageJson, packageJsonPath) {
  for (const workspaceName of Object.keys(workspaceInfo)) {
    for (const dependencyKind of dependencyKinds) {
      if (!packageJson || !packageJson[dependencyKind] || !packageJson[dependencyKind][workspaceName]) {
        continue;
      }

      delete packageJson[dependencyKind][workspaceName];
    }
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function createTemporaryCopy(packageJsonPath, temporaryPackageJsonPath) {
  fs.copyFileSync(
    path.join(packageJsonPath),
    path.join(temporaryPackageJsonPath));
}