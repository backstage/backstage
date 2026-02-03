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

import { applyConfigTransforms, createConfigTransformer } from './apply';

describe('applyConfigTransforms', () => {
  it('should apply no transforms to input', async () => {
    const data = applyConfigTransforms(
      {
        app: {
          title: 'Test',
          x: 1,
          y: [null, true],
          z: null,
        },
      },
      {},
      [],
    );

    await expect(data).resolves.toEqual({
      app: {
        title: 'Test',
        x: 1,
        y: [null, true],
        z: null,
      },
    });
  });

  it('should throw if  input is not an object', async () => {
    const config = applyConfigTransforms('not-config', {}, []);

    await expect(config).rejects.toThrow('expected object at config root');
  });

  it('should apply transforms', async () => {
    const config = applyConfigTransforms(
      {
        app: {
          title: 'Test',
          x: 1,
          y: [null, true],
          z: null,
        },
      },
      {},
      [
        async value => {
          if (typeof value === 'number') {
            return { applied: true, value: value + 1 };
          }
          return { applied: false };
        },
        async value => {
          if (typeof value === 'string' && value.length > 1) {
            return { applied: true, value: value.split('') };
          }
          return { applied: false };
        },
      ],
    );

    await expect(config).resolves.toEqual({
      app: {
        title: ['T', 'e', 's', 't'],
        x: 2,
        y: [null, true],
        z: null,
      },
    });
  });
});

describe('createConfigTransformer', () => {
  const origEnv = process.env;
  process.env = {
    ...process.env,
    SECRET: 'my-secret',
    PADDED_SECRET: ' \nmy-space \t',
  };

  afterAll(() => {
    process.env = origEnv;
  });

  it('should substitute environment variables', async () => {
    const transformer = createConfigTransformer({});

    await expect(
      transformer({
        testAlone: '${SECRET}',
        testMiddle: 'hello ${SECRET}!',
        testSpace: 'hello ${PADDED_SECRET}!',
      }),
    ).resolves.toEqual({
      testAlone: 'my-secret',
      testMiddle: 'hello my-secret!',
      testSpace: 'hello my-space!',
    });
  });
});
