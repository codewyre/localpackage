#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

import { getWorkspaceInfo } from './shared/get-workspace-info.js';
import postinstall from './targets/postinstall.js';
import preinstall from './targets/preinstall.js';

async function main(cwd, argv) {
  const { original: originalArgv } = JSON.parse(process.env.npm_config_argv || '{}');

  const cliEnforced = originalArgv.includes('--force-local');
  const envEnforced = !!process.env.CW_LOCALPACKAGE_ALWAYS_FORCE_LOCAL;
  const configEnforced = await getEnforcingFromConfiguration(cwd);
  if (!cliEnforced && !envEnforced && !configEnforced) {
    console.log('Local packages not enforced. Falling back to publicly deployed ones.');
    process.exit(0);
  }

  if (argv.includes('preinstall')) {
    preinstall(cwd);
    return;
  }

  if (argv.includes('postinstall')) {
    postinstall(cwd);
    return;
  }
}

main(
  process.cwd(),
  process.argv);

async function getEnforcingFromConfiguration(cwd) {
  try {
    const { workspaceRoot } = getWorkspaceInfo(cwd);
    const configPath = path.join(workspaceRoot, '.localpackage.js');

    const config = !fs.existsSync(configPath)
      ? null
      : (await import(configPath)).default;

    return config?.alwaysForceLocal;
  } catch (error) {
    console.log('Could not fetch localpackage workspace config: ', error.message);
    return null;
  }
}
