/*
 * Copyright 2023 The Backstage Authors
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
/*
 * Summary:
 * This script runs a specified command and logs its output to both the terminal and a log file.
 * The log file path is specified using the --log parameter, and the command to run is specified
 * after a -- separator.
 *
 * Why:
 * Some commands do not offer built-in support for output logging. Cross-platform support does
 * not allow simple command redirection to output to a file. This script provides a workaround.
 *
 * Known issues:
 * - The script does not support interactive output that overwrites itself.
 *   e.g. `prettier --check .` will not display individual file progress in the terminal.
 * - The script does not support interactive commands that require user input.
 *
 * Usage:
 * node log-output.js --log <log-file-path> -- <command> [args...]
 *
 * Example:
 * node log-output.js --log ./.tasks/prettier-check.log -- prettier --check .
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const expectedArgs = 4; // Node.js executable, script path, and at least one command argument

if (process.argv.length < expectedArgs) {
  console.error(
    'Usage: node log-output.js --log <log-file-path> -- <command> [args...]',
  );
  process.exit(1);
}

const logIndex = process.argv.indexOf('--log');
const separatorIndex = process.argv.indexOf('--');

if (
  logIndex === -1 ||
  separatorIndex === -1 ||
  separatorIndex <= logIndex + 1
) {
  console.error(
    'Usage: node log-output.js --log <log-file-path> -- <command> [args...]',
  );
  process.exit(1);
}

const logFilePath = process.argv[logIndex + 1];
const command = process.argv[separatorIndex + 1];
const args = process.argv.slice(separatorIndex + 2);

// Ensure the log directory exists
const logDirPath = path.dirname(logFilePath);
if (!fs.existsSync(logDirPath)) {
  fs.mkdirSync(logDirPath, { recursive: true });
}

// Get the current date and time
const now = new Date();
const timestamp = now.toISOString();

const logStream = fs.createWriteStream(logFilePath, { flags: 'w' });
logStream.write(
  `\n--------------------------------------------------------------------------------\n${timestamp}\nCommand: ${command} ${args.join(
    ' ',
  )}\n\nCommand output:\n`,
);

const child = spawn(command, args, { shell: true });

child.stdout.on('data', data => {
  process.stdout.write(data);
  logStream.write(data);
});

child.stderr.on('data', data => {
  process.stderr.write(data);
  logStream.write(data);
});

child.on('close', code => {
  logStream.end(`\nProcess exited with code ${code}\n`);
  if (code !== 0) {
    process.exit(code);
  }
});
