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
import {
  ChildProcessWithoutNullStreams,
  spawnSync,
  SpawnSyncReturns,
} from 'node:child_process';
import * as http from 'http';
import { getOptions, mockDryRunResponse } from './mockData';

const outputDirectory: string = 'dry-run-output';
const fileToRender: string = `${outputDirectory}/Application.java`;

test.describe('scaffolder-cli with example-backend', () => {
  const entryPoint = path.resolve(__dirname, '../bin/scaffolder-cli');

  // Define the mock server
  let server: http.Server;

  test.beforeAll(() => {
    server = http.createServer((req, res) => {
      if (req.url === '/api/scaffolder/v2/dry-run' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
          if (body === JSON.stringify(getOptions())) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(mockDryRunResponse()));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                error: `Invalid request body. Expected: ${JSON.stringify(
                  getOptions(),
                )}`,
              }),
            );
          }
        });
      }
    });

    // Start the server on a specific port
    server.listen(7007, 'localhost');
  });

  test.afterAll(() => {
    // Close the server after all tests are done
    server.close();
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
    await runGenerateCommandAndExpectOutput(
      entryPoint,
      '{"name": "test-service", "package_name": "com.test"}',
    );
    verifyOutputDirectoryExists();
    verifyOutputDirectoryNotEmpty();
    verifyRenderedFileContents();
  });

  test('can generate with yaml file', async () => {
    await runGenerateCommandAndExpectOutput(
      entryPoint,
      'e2e-tests/test-template-dir/test-values.yaml',
    );
    verifyOutputDirectoryExists();
    verifyOutputDirectoryNotEmpty();
    verifyRenderedFileContents();
  });
});

async function runGenerateCommandAndExpectOutput(
  entryPoint: string,
  values: string,
): Promise<void> {
  const proc: ChildProcessWithoutNullStreams = spawn(entryPoint, [
    'generate',
    'e2e-tests/test-template-dir',
    '--values',
    values,
  ]);

  let output = '';
  for await (const chunk of proc.stdout) {
    output += chunk;
  }
  let errors = '';
  for await (const chunk of proc.stderr) {
    errors += chunk;
  }

  expect(errors).toBe('');
  expect(output).toContain('Generated project in');
}

function verifyOutputDirectoryExists(): void {
  const dryRunOutputDir = path.resolve(outputDirectory);
  expect(fs.existsSync(dryRunOutputDir)).toBe(true);
}

function verifyOutputDirectoryNotEmpty(): void {
  const files = fs.readdirSync(outputDirectory);
  expect(files.length).toBeGreaterThan(0);
}

function verifyRenderedFileContents(): void {
  const renderedFileContents = fs.readFileSync(fileToRender).toString();
  expect(renderedFileContents).not.toContain('${{package.name}}');
  expect(renderedFileContents).toContain('com.test');
  expect(renderedFileContents).not.toContain('${{values.name}}');
  expect(renderedFileContents).toContain('test-service');
}
