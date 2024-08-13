#!/usr/bin/env node
import postinstall from './targets/postinstall.js';
import preinstall from './targets/preinstall.js';

function main(cwd, argv) {
  const { original: originalArgv } = JSON.parse(process.env.npm_config_argv || '{}');
  if (!originalArgv.includes('--force-local')) {
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