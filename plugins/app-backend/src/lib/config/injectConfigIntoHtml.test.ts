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

import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import { injectConfigIntoHtml } from './injectConfigIntoHtml';

describe('injectConfigIntoHtml', () => {
  const mockDir = createMockDirectory();

  const baseOptions = {
    appConfigs: [],
    rootDir: mockDir.path,
    staticDir: 'ignored',
    logger: mockServices.logger.mock(),
  };

  beforeEach(() => {
    mockDir.clear();
  });

  it('should template html', async () => {
    mockDir.setContent({
      'index.html.tmpl': "<html><%= config.getNumber('x') %></html>",
    });
    const result = await injectConfigIntoHtml({
      ...baseOptions,
      appConfigs: [{ context: 'mock', data: { x: 1 } }],
    });
    expect(result?.toString('utf8')).toBe('<html>1</html>');
  });

  it('should inject config', async () => {
    mockDir.setContent({
      'index.html.tmpl': '<html><head></head></html>',
    });
    const result = await injectConfigIntoHtml({
      ...baseOptions,
      appConfigs: [{ context: 'mock', data: { x: 1 } }],
    });
    expect(result?.toString('utf8')).toBe(`<html><head>
<script type="backstage.io/config">
[
  {
    "context": "mock",
    "data": {
      "x": 1
    }
  }
]
</script>
</head></html>`);
  });

  it('should trim script tag endings from injected config', async () => {
    mockDir.setContent({
      'index.html.tmpl': '<html><head></head></html>',
    });
    const result = await injectConfigIntoHtml({
      ...baseOptions,
      appConfigs: [
        {
          context: 'mock',
          data: { x: "</script><script>alert('hi')</script><!-- Hi -->" },
        },
      ],
    });
    expect(result?.toString('utf8')).toBe(`<html><head>
<script type="backstage.io/config">
[
  {
    "context": "mock",
    "data": {
      "x": "><script>alert('hi')> Hi -->"
    }
  }
]
</script>
</head></html>`);
  });
});
