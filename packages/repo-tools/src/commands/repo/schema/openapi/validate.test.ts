/*
 * Copyright 2026 The Backstage Authors
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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { validate } from './validate';

const yaml = `openapi: 3.0.3
info:
  title: test
  version: '1'
  x-ratio: .nan
paths: {}
`;

const routerFor = (spec: object) =>
  `import { EndpointMap } from './apis';\nexport const spec = ${JSON.stringify(
    spec,
    null,
    2,
  )} as const;\n`;

const spec = {
  openapi: '3.0.3',
  info: { title: 'test', version: '1', 'x-ratio': null },
  paths: {},
};

describe('validate', () => {
  const mockDir = createMockDirectory();

  it('accepts a generated router that matches the YAML and rejects one that does not', async () => {
    mockDir.setContent({
      'src/schema/openapi.yaml': yaml,
      'src/schema/openapi/generated/router.ts': routerFor(spec),
    });
    await expect(validate(mockDir.path)).resolves.toBeUndefined();

    mockDir.setContent({
      'src/schema/openapi.yaml': yaml,
      'src/schema/openapi/generated/router.ts': routerFor({
        ...spec,
        info: { ...spec.info, title: 'stale' },
      }),
    });
    await expect(validate(mockDir.path)).rejects.toThrow(
      /`src\/schema\/openapi.yaml` and `src\/schema\/openapi\/generated\/router.ts` do not match. Please run `yarn backstage-repo-tools package schema openapi generate` from '.*' to regenerate `src\/schema\/openapi\/generated\/router.ts`./,
    );

    mockDir.setContent({
      'src/schema/openapi.yaml': yaml,
      'src/schema/openapi/generated/router.ts': `export const other = 1;\n`,
    });
    await expect(validate(mockDir.path)).rejects.toThrow(
      /`src\/schema\/openapi\/generated\/router.ts` needs to have a 'spec' export. Please run/,
    );

    mockDir.setContent({
      'src/schema/openapi.yaml': yaml,
      'src/schema/openapi/generated/router.ts': `export const spec = { ...other };\n`,
    });
    await expect(validate(mockDir.path)).rejects.toThrow(
      /`src\/schema\/openapi\/generated\/router.ts`: Unsupported syntax in the 'spec' export on line 1, only plain JSON values are supported. Please run/,
    );

    mockDir.setContent({
      'src/schema/openapi.yaml': yaml,
      'src/schema/openapi/generated/router.ts': {},
    });
    const readError = validate(mockDir.path);
    await expect(readError).rejects.toMatchObject({ code: 'EISDIR' });
    await expect(readError).rejects.not.toThrow(/Please run/);

    mockDir.setContent({ 'src/schema/openapi.yaml': yaml });
    await expect(validate(mockDir.path)).rejects.toThrow(
      'No `src/schema/openapi/generated/router.ts` file found.',
    );

    mockDir.setContent({ 'package.json': '{}' });
    await expect(validate(mockDir.path)).resolves.toBeUndefined();
  });

  it('reads the deprecated schema file and names it in errors', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    mockDir.setContent({
      'src/schema/openapi.yaml': yaml,
      'src/schema/openapi.generated.ts': routerFor(spec),
    });
    await expect(validate(mockDir.path)).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        '`src/schema/openapi.generated.ts` is deprecated',
      ),
    );

    mockDir.setContent({
      'src/schema/openapi.yaml': yaml,
      'src/schema/openapi.generated.ts': routerFor({ ...spec, paths: [] }),
    });
    await expect(validate(mockDir.path)).rejects.toThrow(
      '`src/schema/openapi.yaml` and `src/schema/openapi.generated.ts` do not match.',
    );

    warn.mockRestore();
  });
});
