import { spawn } from 'child_process';

import { createLogger } from './logger';

export function startChild(args: string[]) {
  const [command, ...commandArgs] = args;
  const child = spawn(command, commandArgs, {
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  // We need to avoid clearing the terminal, or the build feedback of dependencies will be lost
  const log = createLogger();
  child.stdout!.on('data', (data: Buffer) => {
    log.out(data.toString('utf8'));
  });
  child.stderr!.on('data', data => {
    log.err(data.toString('utf8'));
  });
}
