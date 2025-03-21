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
import { NotFoundError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { findCodeOwnerByTarget, readCodeOwners } from './read';

const sourceUrl = 'https://github.com/acme/foobar/tree/master/';

const mockCodeowners = `
*       @acme/team-foo @acme/team-bar
/docs   @acme/team-bar
`;

describe('readCodeOwners', () => {
  it('should return found codeowners file', async () => {
    const reader = {
      read: jest.fn(),
      readUrl: jest.fn().mockResolvedValue({
        buffer: jest.fn().mockResolvedValue(Buffer.from(mockCodeowners)),
      }),
      readTree: jest.fn(),
      search: jest.fn(),
    };

    const result = await readCodeOwners(reader, sourceUrl, [
      '.github/CODEOWNERS',
    ]);
    expect(result).toEqual(mockCodeowners);
  });

  it('should return undefined when no codeowner', async () => {
    const reader = {
      read: jest.fn(),
      readUrl: jest.fn().mockResolvedValue({
        buffer: jest.fn().mockRejectedValue(undefined),
      }),
      readTree: jest.fn(),
      search: jest.fn(),
    };

    await expect(
      readCodeOwners(reader, sourceUrl, ['.github/CODEOWNERS']),
    ).resolves.toBeUndefined();
  });

  it('should look at multiple locations', async () => {
    const reader = {
      read: jest.fn(),
      readUrl: jest.fn().mockResolvedValue({
        buffer: jest
          .fn()
          .mockRejectedValue(new NotFoundError('not found'))
          .mockResolvedValue(mockCodeowners),
      }),
      readTree: jest.fn(),
      search: jest.fn(),
    };

    const result = await readCodeOwners(reader, sourceUrl, [
      '.github/CODEOWNERS',
      'docs/CODEOWNERS',
    ]);

    expect(reader.readUrl.mock.calls.length).toBe(2);
    expect(reader.readUrl.mock.calls[0]).toEqual([
      `${sourceUrl}.github/CODEOWNERS`,
    ]);
    expect(reader.readUrl.mock.calls[1]).toEqual([
      `${sourceUrl}docs/CODEOWNERS`,
    ]);
    expect(result).toEqual(mockCodeowners);
  });
});

describe('findCodeOwnerByLocation', () => {
  const setupTest = ({
    target = 'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    codeownersContents: codeOwnersContents = mockCodeowners,
  }: { target?: string; codeownersContents?: string } = {}) => {
    const scmIntegration = ScmIntegrations.fromConfig(
      new ConfigReader({}),
    ).byUrl(target);

    const reader = {
      read: jest.fn(),
      readUrl: jest.fn().mockResolvedValue({
        buffer: jest.fn().mockResolvedValue(codeOwnersContents),
      }),
      readTree: jest.fn(),
      search: jest.fn(),
    };

    return { target, reader, scmIntegration, codeOwnersContents };
  };

  it('should return an owner', async () => {
    const { target, reader, scmIntegration } = setupTest({
      target:
        'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    });

    const result = await findCodeOwnerByTarget(
      reader,
      target,
      scmIntegration as any,
    );

    expect(result).toBe('team-foo');
  });

  it('should return undefined for invalid scm', async () => {
    const { target, reader, scmIntegration } = setupTest({
      target:
        'https://unknown-git-host/backstage/backstage/blob/master/catalog-info.yaml',
      codeownersContents: undefined,
    });

    const result = await findCodeOwnerByTarget(
      reader,
      target,
      scmIntegration as any,
    );

    expect(result).toBeUndefined();
  });
});
