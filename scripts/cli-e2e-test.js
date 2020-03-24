/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { resolve: resolvePath } = require('path');
const childProcess = require('child_process');
const { spawn } = childProcess;
const Browser = require('zombie');

Browser.localhost('localhost', 3000);

async function main() {
  process.env.CI = 'true';

  const projectDir = resolvePath(__dirname, '..');
  process.chdir(projectDir);

  const start = spawnPiped(['yarn', 'start']);

  try {
    const browser = new Browser();

    await waitForPageWithText(browser, '/', 'Welcome to Backstage');
    print('Backstage loaded correctly, creating plugin');

    const createPlugin = spawnPiped(['yarn', 'create-plugin']);
    createPlugin.stdin.write('test-plugin\n');
    await new Promise(resolve => setTimeout(resolve, 2000));
    createPlugin.stdin.write('@someuser\n');

    print('Waiting for plugin create script to be done');
    await waitForExit(createPlugin);

    print('Plugin create script is done, waiting for plugin page to load');
    await waitForPageWithText(
      browser,
      '/test-plugin',
      'Welcome to test-plugin!',
    );

    print('Test plugin loaded correctly, exiting');
  } finally {
    start.kill();
  }
  await waitForExit(start);

  process.exit(0);
}

function print(msg) {
  return process.stdout.write(`${msg}\n`);
}

async function waitForExit(child) {
  if (child.exitCode !== null) {
    throw new Error(`Child already exited with code ${child.exitCode}`);
  }
  await new Promise((resolve, reject) =>
    child.once('exit', code => {
      if (code) {
        reject(new Error(`Child exited with code ${code}`));
      } else {
        resolve();
      }
    }),
  );
}

function spawnPiped(cmd, options) {
  function pipeWithPrefix(stream, prefix = '') {
    return data => {
      const prefixedMsg = data
        .toString('utf8')
        .trimRight()
        .replace(/^/gm, prefix);
      stream.write(`${prefixedMsg}\n`, 'utf8');
    };
  }

  const child = spawn(cmd[0], cmd.slice(1), {
    stdio: 'pipe',
    shell: true,
    ...options,
  });
  child.on('error', handleError);
  child.on('exit', code => {
    if (code) {
      print(`Child '${cmd.join(' ')}' exited with code ${code}`);
      process.exit(code);
    }
  });
  child.stdout.on(
    'data',
    pipeWithPrefix(process.stdout, `[${cmd.join(' ')}].out: `),
  );
  child.stderr.on(
    'data',
    pipeWithPrefix(process.stderr, `[${cmd.join(' ')}].err: `),
  );

  return child;
}

async function waitForPageWithText(
  browser,
  path,
  text,
  { intervalMs = 1000, maxAttempts = 60 } = {},
) {
  let attempts = 0;
  for (;;) {
    try {
      await new Promise(resolve => setTimeout(resolve, intervalMs));
      await browser.visit(path);
      break;
    } catch (error) {
      attempts++;
      if (attempts > maxAttempts) {
        throw new Error(
          `Failed to load page '${path}', max number of attempts reached`,
        );
      }
    }
  }

  const escapedText = text.replace(/"/g, '\\"');
  browser.assert.evaluate(
    `Array.from(document.querySelectorAll("*")).some(el => el.textContent === "${escapedText}")`,
    true,
    `expected to find text ${text}`,
  );
}

function handleError(err) {
  process.stdout.write(`${err.name}: ${err.message}\n`);
  if (typeof err.code === 'number') {
    process.exit(err.code);
  } else {
    process.exit(1);
  }
}

process.on('unhandledRejection', handleError);
main(process.argv.slice(2)).catch(handleError);
