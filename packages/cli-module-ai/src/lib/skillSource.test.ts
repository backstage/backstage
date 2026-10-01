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

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseSkillSource, type ParseSkillSourceOptions } from './skillSource';

describe('parseSkillSource', () => {
  it('parses GitHub, Enterprise and GitLab tree URLs into the skill tree URL', () => {
    expect(
      parseSkillSource(
        'url:https://github.com/acme/skills/tree/main/skills/frontend-design',
      ),
    ).toEqual({
      ok: true,
      source: {
        repoUrl: 'https://github.com/acme/skills',
        ref: 'main',
        installUrl:
          'https://github.com/acme/skills/tree/main/skills/frontend-design',
      },
    });
    // Trailing slash is dropped; Enterprise hosts need GH_HOST for skills.
    expect(
      parseSkillSource('url:https://github.acme.com/o/r/tree/v1/a/b/c/'),
    ).toEqual({
      ok: true,
      source: {
        repoUrl: 'https://github.acme.com/o/r',
        ref: 'v1',
        installUrl: 'https://github.acme.com/o/r/tree/v1/a/b/c',
        ghHost: 'github.acme.com',
      },
    });
    // GitLab hosts are recognized by the "/-/tree/" marker and need no GH_HOST.
    expect(
      parseSkillSource(
        'url:https://gitlab.acme.com/group/sub/repo/-/tree/v1.2/ai/skills/lint/',
      ),
    ).toEqual({
      ok: true,
      source: {
        repoUrl: 'https://gitlab.acme.com/group/sub/repo',
        ref: 'v1.2',
        installUrl:
          'https://gitlab.acme.com/group/sub/repo/-/tree/v1.2/ai/skills/lint',
      },
    });
  });

  it('decodes an encoded path because skills does not decode it', () => {
    expect(
      parseSkillSource('url:https://github.com/a/b/tree/main/my%20skills/s'),
    ).toEqual({
      ok: true,
      source: {
        repoUrl: 'https://github.com/a/b',
        ref: 'main',
        installUrl: 'https://github.com/a/b/tree/main/my skills/s',
      },
    });
  });

  it('reports a reason for locations that cannot be installed', () => {
    const reason = (value: string | undefined) => {
      const result = parseSkillSource(value);
      if (result.ok) throw new Error('expected failure');
      return result.reason;
    };
    expect(reason(undefined)).toMatch(/backstage\.io\/source-location/);
    expect(reason('https://github.com/a/b/tree/main/x')).toMatch(/"url:"/);
    expect(reason('url:not a url')).toMatch(/valid URL/);
    expect(reason('url:ssh://git@github.com/a/b/tree/main/x')).toMatch(/http/);
    expect(reason('url:https://github.com/a/b')).toMatch(/tree URL/);
    expect(reason('url:https://github.com/a/b/tree/main')).toMatch(
      /repository root/,
    );
    expect(reason('url:https://github.com/a/b/tree/main/s/SKILL.md')).toMatch(
      /file.*directory/,
    );
    // skills cannot parse a ref that contains "/" from a tree URL.
    expect(
      reason('url:https://github.com/a/b/tree/feature%2Fx/skills/s'),
    ).toMatch(/contains "\/"/);
    // skills only honors GH_HOST as a bare hostname.
    expect(reason('url:https://github.acme.com:8443/o/r/tree/main/s')).toMatch(
      /port/,
    );
    // Without the GitLab "/-/" form, skills only understands owner/repo.
    expect(
      reason('url:https://gitlab.acme.com/g/sub/repo/tree/main/skills/s'),
    ).toMatch(/owner\/repo/);
    expect(reason('url:https://github.com/a/b/c/tree/main/skills/s')).toMatch(
      /owner\/repo/,
    );
    // skills treats "#" as a ref or skill filter and does not handle "?" or "\".
    expect(reason('url:https://github.com/a/b/tree/main%23x/skills/s')).toMatch(
      /"#"/,
    );
    expect(reason('url:https://github.com/a/b/tree/main/skills%23s/s')).toMatch(
      /"#"/,
    );
    expect(reason('url:https://github.com/a/b/tree/main/skills/s%3Fq')).toMatch(
      /"\?"/,
    );
    expect(reason('url:https://github.com/a/b/tree/main/skills%5Cs')).toMatch(
      /"\\"/,
    );
  });
});

describe('parseSkillSource with file: locations', () => {
  let dir: string;
  let real: string;
  const allow = { allowFileSources: true };
  const reason = (
    location: string,
    options: ParseSkillSourceOptions = allow,
  ) => {
    const result = parseSkillSource(location, options);
    if (result.ok) throw new Error('expected a failure');
    return result.reason;
  };

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-file-source-'));
    real = fs.realpathSync(dir);
    fs.mkdirSync(path.join(dir, 'skill'));
    fs.writeFileSync(path.join(dir, 'skill', 'SKILL.md'), '# skill');
    fs.mkdirSync(path.join(dir, 'empty'));
    fs.writeFileSync(path.join(dir, 'file.txt'), 'x');
    fs.symlinkSync(path.join(dir, 'skill'), path.join(dir, 'link'));
  });
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('is skipped unless file sources are allowed', () => {
    const location = `file:${dir}/skill`;
    expect(reason(location, {})).toBe(
      'file sources are disabled; pass --allow-file-sources',
    );
    expect(reason(location, { allowFileSources: false })).toMatch(
      /--allow-file-sources/,
    );
  });

  it('accepts absolute directories with SKILL.md, resolving symlinks to the real path', () => {
    const expected = {
      ok: true,
      source: {
        repoUrl: path.join(real, 'skill'),
        ref: '',
        installUrl: path.join(real, 'skill'),
        localPath: path.join(real, 'skill'),
      },
    };
    expect(parseSkillSource(`file:${dir}/skill`, allow)).toEqual(expected);
    expect(parseSkillSource(`file:${dir}/skill/`, allow)).toEqual(expected);
    expect(parseSkillSource(`file://${dir}/skill`, allow)).toEqual(expected);
    expect(parseSkillSource(`file:${dir}/link`, allow)).toEqual(expected);
  });

  it('decodes percent-encoded paths the same way in both forms', () => {
    fs.mkdirSync(path.join(dir, 'a b'));
    fs.writeFileSync(path.join(dir, 'a b', 'SKILL.md'), '# skill');
    const expected = path.join(real, 'a b');
    for (const location of [`file:${dir}/a%20b`, `file://${dir}/a%20b`]) {
      expect(parseSkillSource(location, allow)).toMatchObject({
        ok: true,
        source: { localPath: expected },
      });
    }
    expect(reason(`file:${dir}/a%ZZb`)).toMatch(/not a valid/);
  });

  it('reports unreadable and unstat-able paths without throwing', () => {
    const probe = {
      realpath: () => {
        throw new Error('EACCES: permission denied');
      },
      isDirectory: () => true,
      hasSkillMd: () => true,
    };
    expect(reason('file:/x', { allowFileSources: true, probe })).toBe(
      'the path /x cannot be read: EACCES: permission denied',
    );
    const statFails = {
      realpath: (p: string) => p,
      isDirectory: () => false,
      hasSkillMd: () => true,
    };
    expect(
      reason('file:/x', {
        allowFileSources: true,
        probe: statFails,
      }),
    ).toBe('/x is not a directory');
  });

  it('explains why a local source cannot be used', () => {
    expect(reason('file:skills/a')).toBe('file sources must be absolute paths');
    expect(reason('file:')).toBe('file sources must be absolute paths');
    expect(reason(`file:${dir}/missing`)).toBe(
      `the directory ${path.join(dir, 'missing')} does not exist`,
    );
    expect(reason(`file:${dir}/file.txt`)).toBe(
      `${path.join(real, 'file.txt')} is not a directory`,
    );
    expect(reason(`file:${dir}/empty`)).toBe(
      `${path.join(real, 'empty')} does not contain SKILL.md directly`,
    );
    expect(reason('file://host/share/skill')).toBe(
      'file URLs with a host are not supported',
    );
  });
});
