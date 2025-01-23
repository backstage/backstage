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

import { npath, ppath, xfs } from '@yarnpkg/fslib';
import { createMockDirectory } from '@backstage/backend-test-utils';
import { memoize } from './memoize';
import { getCurrentBackstageVersion } from './getCurrentBackstageVersion';

/**
 * Disable memoization to allow testing behavior under a variety of
 * circumstances.
 */
jest.mock('./memoize', () => {
  const memoizeMock: jest.MockedFn<typeof memoize> & {
    memoizationEnabled?: boolean;
  } = jest.fn(fn => {
    const memoized = jest.requireActual('./memoize').memoize(fn);

    return () => {
      if (memoizeMock.memoizationEnabled) {
        return memoized();
      }

      return fn();
    };
  });

  return { memoize: memoizeMock };
});

const memoizeMock = memoize as jest.MockedFunction<typeof memoize> & {
  memoizationEnabled?: boolean;
};

describe('getCurrentBackstageVersion', () => {
  const mockDir = createMockDirectory();

  beforeEach(() => {
    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(npath.toPortablePath(mockDir.path));

    jest
      .spyOn(ppath, 'cwd')
      .mockReturnValue(npath.toPortablePath(mockDir.path));

    mockDir.setContent({
      'package.json': JSON.stringify({}),
    });
  });

  it('retrieves the version of Backstage from backstage.json', () => {
    mockDir.addContent({
      'backstage.json': JSON.stringify({
        version: '1.23.45',
      }),
    });

    expect(getCurrentBackstageVersion()).toEqual('1.23.45');
  });

  it.each`
    description              | content
    ${'is missing'}          | ${{}}
    ${'is invalid'}          | ${{ 'backstage.json': '}{' }}
    ${'has missing version'} | ${{ 'backstage.json': '{"a":"b"}' }}
    ${'has invalid version'} | ${{ 'backstage.json': '{"version":"foobar"}' }}
  `('throws if backstage.json $description', ({ content }) => {
    mockDir.addContent(content);

    expect(() => getCurrentBackstageVersion()).toThrow(
      /valid version string not found/i,
    );
  });

  it('caches repeated calls', () => {
    mockDir.addContent({
      'backstage.json': JSON.stringify({
        version: '1.23.45',
      }),
    });

    memoizeMock.memoizationEnabled = true;

    const readJsonSyncSpy = jest.spyOn(xfs, 'readJsonSync');

    expect(readJsonSyncSpy).toHaveBeenCalledTimes(0);

    getCurrentBackstageVersion();
    getCurrentBackstageVersion();

    expect(readJsonSyncSpy).toHaveBeenCalledTimes(1);
  });
});
