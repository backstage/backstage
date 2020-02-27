import { spawn } from 'child_process';
import { Logger } from './logger';
import chalk from 'chalk';
import { Package } from './packages';

export function startCompiler(pkg: Package, log: Logger) {
  // First we figure out which yarn script is a available, falling back to "build --watch"
  const scriptName = ['build:watch', 'watch'].find(
    script => script in pkg.scripts,
  );
  const args = scriptName ? [scriptName] : ['build', '--watch'];

  // Start the watch script inside the dependency
  const watch = spawn('yarn', ['run', ...args], {
    cwd: pkg.location,
    stdio: 'pipe',
  });

  watch.stdout!.on('data', (data: Buffer) => {
    log.out(data.toString('utf8'));
  });

  watch.stderr!.on('data', data => {
    log.err(data.toString('utf8'));
  });

  const promise = new Promise<void>((resolve, reject) => {
    watch.on('error', error => {
      reject(error);
    });

    watch.on('close', (code: number) => {
      if (code !== 0) {
        const msg = `Compiler exited with code ${code}`;
        log.err(chalk.red(msg));
        reject(new Error(msg));
      } else {
        resolve();
      }
    });
  });

  return {
    promise,
    close() {
      watch.kill('SIGINT');
    },
  };
}
