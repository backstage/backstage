/*
 * Copyright 2020 Spotify AB
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

import { LocationSpec } from '@backstage/catalog-model';
import { CodeOwnersEntry } from 'codeowners-utils';
import {
  buildCodeOwnerLocation,
  buildUrl,
  CodeOwnersProcessor,
  findPrimaryCodeOwner,
  findRawCodeOwners,
  normalizeCodeOwner,
  parseCodeOwners,
  resolveCodeOwner,
} from './CodeOwnersProcessor';

describe(CodeOwnersProcessor, () => {
  const mockLocation = ({
    basePath = '',
    type = 'github',
  } = {}): LocationSpec => ({
    type,
    target: `https://github.com/spotify/backstage/blob/master/${basePath}catalog-info.yaml`,
  });

  const mockReadLocation = (basePath = '') => ({
    type: 'github',
    target: `https://github.com/spotify/backstage/blob/master/${basePath}CODEOWNERS`,
  });

  const mockGitUri = (codeOwnersPath: string = '') => {
    return {
      source: 'github.com',
      owner: 'spotify',
      name: 'backstage',
      codeOwnersPath,
    };
  };

  const mockCodeOwnersText = () => `
# https://help.github.com/articles/about-codeowners/
*                  @spotify/backstage-core @acme/team-foo
/plugins/techdocs  @spotify/techdocs-core
  `;

  const mockCodeOwners = (): CodeOwnersEntry[] => {
    return [
      {
        pattern: '/plugins/techdocs',
        owners: ['@spotify/techdocs-core'],
      },
      { pattern: '*', owners: ['@spotify/backstage-core', '@acme/team-foo'] },
    ];
  };

  const mockReadResult = ({
    error = undefined,
    data = undefined,
  }: {
    error?: string;
    data?: string;
  } = {}) => {
    if (error) {
      throw Error(error);
    }
    return data;
  };

  describe(buildUrl, () => {
    it.each([['azure.com'], ['dev.azure.com']])(
      'should throw not implemented error',
      source => {
        expect(() => buildUrl({ ...mockGitUri(), source })).toThrow();
      },
    );

    it('should build github.com url', () => {
      expect(
        buildUrl({
          ...mockGitUri(),
          codeOwnersPath: '/.github/CODEOWNERS',
        }),
      ).toBe(
        'https://github.com/spotify/backstage/blob/master/.github/CODEOWNERS',
      );
    });
  });

  describe(buildCodeOwnerLocation, () => {
    it('should builds a location spec to the codeowners', () => {
      expect(
        buildCodeOwnerLocation(mockLocation(), '/docs/CODEOWNERS'),
      ).toEqual({
        type: 'github',
        target:
          'https://github.com/spotify/backstage/blob/master/docs/CODEOWNERS',
      });
    });

    it('should handle nested paths from original location spec', () => {
      expect(
        buildCodeOwnerLocation(
          mockLocation({ basePath: 'packages/foo/' }),
          '/CODEOWNERS',
        ),
      ).toEqual({
        type: 'github',
        target: 'https://github.com/spotify/backstage/blob/master/CODEOWNERS',
      });
    });
  });

  describe(parseCodeOwners, () => {
    it('should parse the codeowners file', () => {
      expect(parseCodeOwners(mockCodeOwnersText())).toEqual(mockCodeOwners());
    });
  });

  describe(normalizeCodeOwner, () => {
    it('should remove org from org/team format', () => {
      expect(normalizeCodeOwner('@acme/foo')).toBe('foo');
    });

    it('should return username from email format', () => {
      expect(normalizeCodeOwner('foo@acme.com')).toBe('foo');
    });

    it.each([['acme/foo'], ['dacme/foo']])(
      'should return string everything else',
      owner => {
        expect(normalizeCodeOwner(owner)).toBe(owner);
      },
    );
  });

  describe(findPrimaryCodeOwner, () => {
    it('should return the primary owner', () => {
      expect(findPrimaryCodeOwner(mockCodeOwners())).toBe('backstage-core');
    });
  });

  describe(findRawCodeOwners, () => {
    it('should return found codeowner', async () => {
      const ownersText = mockCodeOwnersText();
      const read = jest
        .fn()
        .mockResolvedValue(mockReadResult({ data: ownersText }));
      const result = await findRawCodeOwners(mockLocation(), read);
      expect(result).toEqual(ownersText);
    });

    it('should raise error when no codeowner', async () => {
      const read = jest.fn().mockRejectedValue(mockReadResult());

      await expect(
        findRawCodeOwners(mockLocation(), read),
      ).rejects.toBeInstanceOf(Error);
    });

    it('should look at known codeowner locations', async () => {
      const ownersText = mockCodeOwnersText();
      const read = jest
        .fn()
        .mockImplementationOnce(() => mockReadResult({ error: 'foo' }))
        .mockImplementationOnce(() => mockReadResult({ error: 'bar' }))
        .mockResolvedValue(mockReadResult({ data: ownersText }));

      const result = await findRawCodeOwners(mockLocation(), read);

      expect(read.mock.calls.length).toBe(3);
      expect(read.mock.calls[0]).toEqual([mockReadLocation('.github/')]);
      expect(read.mock.calls[1]).toEqual([mockReadLocation('')]);
      expect(read.mock.calls[2]).toEqual([mockReadLocation('docs/')]);
      expect(result).toEqual(ownersText);
    });
  });

  describe(resolveCodeOwner, () => {
    it('should return found codeowner', async () => {
      const read = jest
        .fn()
        .mockResolvedValue(mockReadResult({ data: mockCodeOwnersText() }));
      const owner = await resolveCodeOwner(mockLocation(), read);
      expect(owner).toBe('backstage-core');
    });

    it('should raise an error when no codeowner', async () => {
      const read = jest
        .fn()
        .mockImplementation(() => mockReadResult({ error: 'error: foo' }));

      await expect(
        resolveCodeOwner(mockLocation(), read),
      ).rejects.toBeInstanceOf(Error);
    });
  });

  describe(CodeOwnersProcessor, () => {
    const setupTest = ({ kind = 'Component', spec = {} } = {}) => {
      const entity = { kind, spec };
      const processor = new CodeOwnersProcessor();
      const read = jest
        .fn()
        .mockResolvedValue(mockReadResult({ data: mockCodeOwnersText() }));

      return { entity, processor, read };
    };

    it('should not modify existing owner', async () => {
      const { entity, processor } = setupTest({
        spec: { owner: '@acme/foo-team' },
      });

      const result = await processor.processEntity(
        entity as any,
        mockLocation(),
        null as any,
        null as any,
      );

      expect(result).toEqual(entity);
    });

    it('should ignore url locations', async () => {
      const { entity, processor } = setupTest();

      const result = await processor.processEntity(
        entity as any,
        mockLocation({ type: 'url' }),
        null as any,
        null as any,
      );

      expect(result).toEqual(entity);
    });

    it('should ignore invalid kinds', async () => {
      const { entity, processor } = setupTest({ kind: 'Group' });

      const result = await processor.processEntity(
        entity as any,
        mockLocation(),
        null as any,
        null as any,
      );

      expect(result).toEqual(entity);
    });

    it('should set owner from codeowner', async () => {
      const { entity, processor, read } = setupTest();

      const result = await processor.processEntity(
        entity as any,
        mockLocation(),
        null as any,
        read,
      );

      expect(result).toEqual({
        ...entity,
        spec: { owner: 'backstage-core' },
      });
    });
  });
});
