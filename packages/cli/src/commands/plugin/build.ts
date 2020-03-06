import chalk from 'chalk';
import { Command } from 'commander';
import { spawnSync } from 'child_process';

export default async (cmd: Command) => {
  const args = [
    '--outDir',
    'dist/cjs',
    '--noEmit',
    'false',
    '--module',
    'CommonJS',
  ];

  if (cmd.watch) {
    args.push('--watch');
  }

  try {
    spawnSync('tsc', args, { stdio: 'inherit' });
  } catch (error) {
    process.stderr.write(`${chalk.red(error.message)}\n`);
    process.exit(1);
  }
};
