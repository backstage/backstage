/*
 * Copyright 2025 The Backstage Authors
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
import { ScmIntegrationRegistry } from '@backstage/integration';
import { parseRepoUrl } from './util';

const queryString = (
  params: Partial<
    Record<'owner' | 'organization' | 'workspace' | 'project' | 'repo', string>
  > = {},
): string => {
  const pEntries = Object.entries(params);
  if (pEntries.length) {
    return `?${pEntries
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')}`;
  }
  return '';
};

describe('scaffolder action utils', () => {
  describe('parseRepoUrl', () => {
    const byHost = jest.fn();
    const integrations = {
      byHost,
    } as unknown as ScmIntegrationRegistry;

    describe('rejects url when', () => {
      it('empty', () =>
        expect(() => parseRepoUrl('', integrations)).toThrow(
          /Invalid repo URL passed/,
        ));
      it('blank', () =>
        expect(() => parseRepoUrl(' ', integrations)).toThrow(
          /Invalid repo URL passed/,
        ));
    });
    it('requires that host match an integration type', () => {
      byHost.mockClear();
      expect(() => parseRepoUrl('foo', integrations)).toThrow(
        /No matching integration configuration for host/,
      );
    });
    describe('bitbucket', () => {
      beforeEach(() => byHost.mockReturnValue({ type: 'bitbucket' }));
      describe('cloud', () => {
        const [host, workspace, project, repo] = [
          'www.bitbucket.org',
          'foo',
          'bar',
          'baz',
        ];
        it('requires workspace', () =>
          expect(() =>
            parseRepoUrl(
              `${host}${queryString({ project, repo })}`,
              integrations,
            ),
          ).toThrow(/missing workspace/));
        it('requires project', () =>
          expect(() =>
            parseRepoUrl(
              `${host}${queryString({ workspace, repo })}`,
              integrations,
            ),
          ).toThrow(/missing project/));
        it('requires repo', () =>
          expect(() =>
            parseRepoUrl(
              `${host}${queryString({ workspace, project })}`,
              integrations,
            ),
          ).toThrow(/missing repo/));
        it('happy path', () =>
          expect(
            parseRepoUrl(
              `${host}${queryString({ workspace, project, repo })}`,
              integrations,
            ),
          ).toMatchObject({
            host,
            workspace,
            project,
            repo,
          }));
      });
      describe('other', () => {
        const [host, project, repo] = ['bitbucket.other', 'foo', 'bar'];
        it('requires project', () =>
          expect(() =>
            parseRepoUrl(`${host}${queryString({ repo })}`, integrations),
          ).toThrow(/missing project/));
        it('requires repo', () =>
          expect(() =>
            parseRepoUrl(`${host}${queryString({ project })}`, integrations),
          ).toThrow(/missing repo/));
        it('happy path', () =>
          expect(
            parseRepoUrl(
              `${host}${queryString({ project, repo })}`,
              integrations,
            ),
          ).toMatchObject({
            host,
            project,
            repo,
          }));
      });
    });
    describe('azure', () => {
      beforeEach(() => byHost.mockReturnValue({ type: 'azure' }));
      const [host, project, repo] = ['az.ure', 'foo', 'bar'];
      it('requires project', () =>
        expect(() =>
          parseRepoUrl(`${host}${queryString({ repo })}`, integrations),
        ).toThrow(/missing project/));
      it('requires repo', () =>
        expect(() =>
          parseRepoUrl(`${host}${queryString({ project })}`, integrations),
        ).toThrow(/missing repo/));
      it('happy path', () =>
        expect(
          parseRepoUrl(
            `${host}${queryString({ project, repo })}`,
            integrations,
          ),
        ).toMatchObject({
          host,
          project,
          repo,
        }));
    });
    describe('gitlab', () => {
      beforeEach(() => byHost.mockReturnValue({ type: 'gitlab' }));
      const [host, owner, repo, project] = ['gitl.ab', 'foo', 'bar', '123456'];
      it('requires owner', () =>
        expect(() =>
          parseRepoUrl(`${host}${queryString({ repo })}`, integrations),
        ).toThrow(/missing owner/));
      it('requires repo', () =>
        expect(() =>
          parseRepoUrl(`${host}${queryString({ owner })}`, integrations),
        ).toThrow(/missing repo/));
      it('unless project specified', () =>
        expect(
          parseRepoUrl(`${host}${queryString({ project })}`, integrations),
        ).toMatchObject({ host, project }));
      it('happy path', () =>
        expect(
          parseRepoUrl(`${host}${queryString({ owner, repo })}`, integrations),
        ).toMatchObject({
          host,
          owner,
          repo,
        }));
    });
    describe('gitea', () => {
      beforeEach(() => byHost.mockReturnValue({ type: 'gitea' }));
      const [host, repo] = ['git.ea', 'foo'];
      it('requires repo', () =>
        expect(() => parseRepoUrl(host, integrations)).toThrow(/missing repo/));
      it('happy path', () =>
        expect(
          parseRepoUrl(`${host}${queryString({ repo })}`, integrations),
        ).toMatchObject({ host, repo }));
    });
    describe('gerrit', () => {
      beforeEach(() => byHost.mockReturnValue({ type: 'gerrit' }));
      const [host, repo] = ['gerr.it', 'foo'];
      it('requires repo', () =>
        expect(() => parseRepoUrl(host, integrations)).toThrow(/missing repo/));
      it('happy path', () =>
        expect(
          parseRepoUrl(`${host}${queryString({ repo })}`, integrations),
        ).toMatchObject({
          host,
          repo,
        }));
    });
    describe('generic type', () => {
      beforeEach(() => byHost.mockReturnValue({ type: 'generic' }));
      const [host, owner, repo] = ['oth.er', 'foo', 'bar'];
      it('requires owner', () =>
        expect(() =>
          parseRepoUrl(`${host}${queryString({ repo })}`, integrations),
        ).toThrow(/missing owner/));
      it('requires repo', () =>
        expect(() =>
          parseRepoUrl(`${host}${queryString({ owner })}`, integrations),
        ).toThrow(/missing repo/));
      it('happy path', () =>
        expect(
          parseRepoUrl(`${host}${queryString({ owner, repo })}`, integrations),
        ).toMatchObject({
          host,
          owner,
          repo,
        }));
    });
    describe('facilitates naive URL construction', () => {
      beforeEach(() => byHost.mockReturnValue({ type: 'irrelevant' }));
      it('decodes encoded params', () => {
        const [host, owner, repo] = ['with_the_most', 'foo/bar/baz', 'blah'];
        expect(
          parseRepoUrl(`${host}${queryString({ owner, repo })}`, integrations),
        ).toMatchObject({ host, owner, repo });
      });
    });
  });
});
