/*
 * Copyright 2024 The Backstage Authors
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
import { test, expect } from '@playwright/test';
import { spawn } from 'child_process';
import path from 'path';
import * as fs from 'node:fs';
import { spawnSync } from 'node:child_process';

test.describe('scaffolder-cli with example-backend', () => {
  let serverProcess: any;
  const entryPoint = path.resolve(__dirname, '../bin/scaffolder-cli');

  test.beforeAll(() => {
    serverProcess = spawn('yarn', ['start-backend'], {
      cwd: path.resolve(__dirname, '../../../'),
    });

    serverProcess.stdout.on('data', (data: Buffer) => {
      console.log(`stdout: ${data}`);
    });

    serverProcess.stderr.on('data', (data: Buffer) => {
      console.error(`stderr: ${data}`);
    });

    serverProcess.on('close', (code: number) => {
      console.log(`child process exited with code ${code}`);
    });
  });

  test.afterAll(() => {
    serverProcess.kill();
  });

  test('shows help text', async () => {
    const proc = await spawn(entryPoint, ['--help']);
    let output = '';
    for await (const chunk of proc.stdout) {
      output += chunk;
    }
    expect(output).toContain('Usage: scaffolder-cli [options]');
  });

  test('can generate with inline json', async () => {
    const proc = await spawn(entryPoint, [
      'generate',
      'cli-e2e-tests/test-template-dir',
      '--values',
      '{"name": "test-service", "package_name": "com.test"}',
    ]);
    let output = '';
    for await (const chunk of proc.stdout) {
      output += chunk;
    }
    expect(output).toContain('Generated project in');

    // Check if the dry-run-output directory exists
    const dryRunOutputDir = path.resolve('dry-run-output');
    expect(fs.existsSync(dryRunOutputDir)).toBe(true);

    // Check if the directory is not empty
    const files = fs.readdirSync(dryRunOutputDir);
    expect(files.length).toBeGreaterThan(0);
  });

  test('can generate with yaml file', async () => {
    const proc = await spawn(entryPoint, [
      'generate',
      'cli-e2e-tests/test-template-dir',
      '--values',
      'cli-e2e-tests/test-template-dir/test-values.yaml',
    ]);
    let output = '';
    for await (const chunk of proc.stdout) {
      output += chunk;
    }
    expect(output).toContain('Generated project in');

    // Check if the dry-run-output directory exists
    const dryRunOutputDir = path.resolve('dry-run-output');
    expect(fs.existsSync(dryRunOutputDir)).toBe(true);

    // Check if the directory is not empty
    const files = fs.readdirSync(dryRunOutputDir);
    expect(files.length).toBeGreaterThan(0);

    // Try to compile the Application.java file
    const compile = spawnSync('javac', [`${dryRunOutputDir}/Application.java`]);
    if (compile.error) {
      console.error(`stderr: ${compile.stderr.toString()}`);
      throw compile.error;
    }
  });
});
