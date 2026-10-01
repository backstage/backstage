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

import { parseSkillSource } from './skillSource';

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
