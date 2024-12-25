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
import { ConfigReader, Config } from '@backstage/config';
import {
  ConfluenceIntegrationConfig,
  readConfluenceIntegrationConfig,
  readConfluenceIntegrationConfigs,
} from './config';

describe('Confluence Integration config', () => {
  function buildConfig(data: Partial<ConfluenceIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  it('reads values from a config', () => {
    const output = readConfluenceIntegrationConfig(
      buildConfig({
        host: 'mycompany.atlassian.net',
        apiToken: 'dXNlcjpwYXNzd29yZAoJRW5jb2RlZDpzZWNyZXQ=',
      }),
    );

    expect(output).toEqual({
      host: 'mycompany.atlassian.net',
      apiToken: 'Basic dXNlcjpwYXNzd29yZAoJRW5jb2RlZDpzZWNyZXQ=',
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'mycompany.atlassian.net',
      apiToken: 'dXNlcjpwYXNzd29yZAoJRW5jb2RlZDpzZWNyZXQ=',
    };
    expect(() =>
      readConfluenceIntegrationConfig(
        buildConfig({ ...valid, host: 'example.backstage.net' }),
      ),
    ).toThrow(/host/);
    expect(() =>
      readConfluenceIntegrationConfig(buildConfig({ ...valid, host: 2 })),
    ).toThrow(/host/);
    expect(() =>
      readConfluenceIntegrationConfig(buildConfig({ ...valid, apiToken: 2 })),
    ).toThrow(/apiToken/);
  });

  it('reads all values', () => {
    const integrations = [
      {
        host: 'mycompany1.atlassian.net',
        apiToken: 'dXNlcjpwYXNzd29yZAoJRW5jb2RlZDpzZWNyZXQ=',
      },
      {
        host: 'mycompany2.atlassian.net',
        apiToken: 'dXNlcjpwYXNzd29yZAoJRW5jb2RlZDpzZWNyZXQ=',
      },
    ];
    const config = new ConfigReader({
      integrations: {
        confluence: integrations,
      },
    });
    const output = readConfluenceIntegrationConfigs(config);

    expect(output).toEqual([
      {
        host: 'mycompany1.atlassian.net',
        apiToken: 'Basic dXNlcjpwYXNzd29yZAoJRW5jb2RlZDpzZWNyZXQ=',
      },
      {
        host: 'mycompany2.atlassian.net',
        apiToken: 'Basic dXNlcjpwYXNzd29yZAoJRW5jb2RlZDpzZWNyZXQ=',
      },
    ]);
  });
});
