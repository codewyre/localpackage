import child_process from 'child_process';

import { findWorkspaceRoot } from '../services/yarn-workspace.service.js';

export function getWorkspaceInfo(cwd) {
  const workspaceRoot = findWorkspaceRoot(cwd);
  const workspaceInfoString = child_process.execSync(
    'yarn -s workspaces info', {
      cwd: workspaceRoot
    }).toString();

  const workspaceInfo = JSON.parse(workspaceInfoString);
  return { workspaceRoot, workspaceInfo };
}
