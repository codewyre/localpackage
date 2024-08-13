import path from 'path';

import { readPackageJSON } from './npm-package.service.js';

/**
 * Adapted from:
 * https://github.com/yarnpkg/yarn/blob/ddf2f9ade211195372236c2f39a75b00fa18d4de/src/config.js#L612
 * @param {string} [initial]
 * @return {string|null}
 */
export function findWorkspaceRoot(cwd, initial = undefined) {
  if (!initial) {
    initial = cwd;
  }
  let previous = null;
  let current = path.normalize(initial);

  do {
    const manifest = readPackageJSON(current);
    const workspaces = extractWorkspaces(manifest);

    if (workspaces?.length) {
      return current;
    }

    previous = current;
    current = path.dirname(current);
  } while (current !== previous);

  return null;
}

function extractWorkspaces(manifest) {
  const workspaces = (manifest || {}).workspaces;
  return (workspaces && workspaces.packages) || (Array.isArray(workspaces) ? workspaces : null);
}