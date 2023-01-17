/*
 * Copyright 2020 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import { readHttpServerOptions } from './config';

describe('readHttpServerOptions', () => {
  it('should return defaults', () => {
    expect(readHttpServerOptions()).toEqual({
      listen: { host: '', port: 7007 },
    });
  });

  it.each([
    [{}, { listen: { host: '', port: 7007 } }],
    [{ listen: ':80' }, { listen: { host: '', port: 80 } }],
    [{ listen: '80' }, { listen: { host: '', port: 80 } }],
    [{ listen: '1.2.3.4:80' }, { listen: { host: '1.2.3.4', port: 80 } }],
    [{ listen: { host: '' } }, { listen: { host: '', port: 7007 } }],
    [
      { listen: { host: '0.0.0.0' } },
      { listen: { host: '0.0.0.0', port: 7007 } },
    ],
    [
      { listen: { host: '0.0.0.0', port: '80' } },
      { listen: { host: '0.0.0.0', port: 80 } },
    ],
    [{ listen: { port: '80' } }, { listen: { host: '', port: 80 } }],
    [{ listen: { port: 80 } }, { listen: { host: '', port: 80 } }],
    [{ listen: { port: 80 } }, { listen: { host: '', port: 80 } }],
    [
      { baseUrl: 'http://example.com:8080', https: true },
      {
        listen: { host: '', port: 7007 },
        https: { certificate: { type: 'generated', hostname: 'example.com' } },
      },
    ],
    [
      { https: { certificate: { cert: 'my-cert', key: 'my-key' } } },
      {
        listen: { host: '', port: 7007 },
        https: {
          certificate: { type: 'plain', cert: 'my-cert', key: 'my-key' },
        },
      },
    ],
  ])('should read http server options %#', (input, output) => {
    expect(readHttpServerOptions(new ConfigReader(input))).toEqual(output);
  });

  it.each([
    [
      { listen: { port: 'not-a-number' } },
      "Unable to convert config value for key 'listen.port' in 'mock-config' to a number",
    ],
    [
      { listen: { port: {} } },
      "Invalid type in config for key 'listen.port' in 'mock-config', got object, wanted number",
    ],
    [
      { listen: { host: false } },
      "Invalid type in config for key 'listen.host' in 'mock-config', got boolean, wanted string",
    ],
    [{ https: {} }, "Missing required config value at 'https.certificate.cert"],
    [
      { https: { certificate: { cert: 'x' } } },
      "Missing required config value at 'https.certificate.key",
    ],
  ])('should throw on bad options %#', (input, message) => {
    expect(() => readHttpServerOptions(new ConfigReader(input))).toThrow(
      message,
    );
  });
});
