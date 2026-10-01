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
import { buildHookCommand, installHooks } from './installHooks';
import { shellQuote } from './shellQuote';

describe('buildHookCommand', () => {
  it('quotes the node and script paths and passes the agent and instance', () => {
    expect(
      buildHookCommand({
        execPath: '/usr/local/bin/node',
        scriptPath: '/repo/node_modules/@backstage/cli/bin/backstage-cli',
        agent: 'claude-code',
      }),
    ).toBe(
      '/usr/local/bin/node /repo/node_modules/@backstage/cli/bin/backstage-cli ai skills sync --hook --agent claude-code',
    );
    expect(
      buildHookCommand({
        execPath: '/Users/Jane Doe/n ode',
        scriptPath: "/Users/Jane Doe/it's/bin/backstage-cli",
        agent: 'claude-code',
        instance: 'my instance',
      }),
    ).toBe(
      "'/Users/Jane Doe/n ode' '/Users/Jane Doe/it'\\''s/bin/backstage-cli' ai skills sync --hook --agent claude-code --instance 'my instance'",
    );
  });
});

describe('shellQuote', () => {
  it('quotes arguments that a shell would expand', () => {
    expect(shellQuote('~root')).toBe("'~root'");
    expect(shellQuote('=x')).toBe("'=x'");
    expect(shellQuote('a=b')).toBe('a=b');
  });
});

describe('installHooks', () => {
  let root: string;
  const base = () => ({
    rootDir: root,
    execPath: '/bin/node',
    scriptPath: '/bin/backstage-cli',
    exec: async () => {
      throw Object.assign(new Error('not a repo'), { code: 128 });
    },
  });
  const command = (agent: string, instance?: string) =>
    buildHookCommand({
      execPath: '/bin/node',
      scriptPath: '/bin/backstage-cli',
      agent,
      instance,
    });
  const read = (file: string) => fs.readFileSync(path.join(root, file), 'utf8');

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-hooks-'));
  });
  afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
  });

  it('creates the settings file and directory when missing', async () => {
    const results = await installHooks({ ...base(), agents: ['claude-code'] });

    expect(results).toEqual([
      {
        agent: 'claude-code',
        file: path.join(root, '.claude', 'settings.local.json'),
        written: true,
      },
    ]);
    const text = read('.claude/settings.local.json');
    expect(text.endsWith('}\n')).toBe(true);
    expect(text).toContain('\n  "hooks": {');
    expect(JSON.parse(text)).toEqual({
      hooks: {
        SessionStart: [
          {
            matcher: 'startup|resume',
            hooks: [
              {
                type: 'command',
                command: command('claude-code'),
                timeout: 120,
              },
            ],
          },
        ],
      },
    });
  });

  it('merges into an empty file and keeps other settings and hooks', async () => {
    fs.mkdirSync(path.join(root, '.claude'));
    fs.writeFileSync(path.join(root, '.claude/settings.local.json'), '  \n');
    await installHooks({ ...base(), agents: ['claude-code'] });
    expect(
      JSON.parse(read('.claude/settings.local.json')).hooks.SessionStart,
    ).toHaveLength(1);

    const other = { type: 'command', command: 'echo hi' };
    fs.writeFileSync(
      path.join(root, '.claude/settings.local.json'),
      JSON.stringify({
        permissions: { allow: ['Bash(ls)'] },
        hooks: {
          PreToolUse: [{ matcher: 'Bash', hooks: [other] }],
          SessionStart: [
            { matcher: 'clear', hooks: [other] },
            {
              matcher: 'startup',
              hooks: [
                other,
                {
                  type: 'command',
                  command: 'old ai skills sync --hook --agent x',
                },
              ],
            },
          ],
        },
      }),
    );
    await installHooks({
      ...base(),
      agents: ['claude-code'],
      instance: 'prod',
    });

    expect(JSON.parse(read('.claude/settings.local.json'))).toEqual({
      permissions: { allow: ['Bash(ls)'] },
      hooks: {
        PreToolUse: [{ matcher: 'Bash', hooks: [other] }],
        SessionStart: [
          { matcher: 'clear', hooks: [other] },
          { matcher: 'startup', hooks: [other] },
          {
            matcher: 'startup|resume',
            hooks: [
              {
                type: 'command',
                command: command('claude-code', 'prod'),
                timeout: 120,
              },
            ],
          },
        ],
      },
    });
  });

  it('is idempotent', async () => {
    await installHooks({ ...base(), agents: ['claude-code'] });
    const first = read('.claude/settings.local.json');
    await installHooks({ ...base(), agents: ['claude-code'] });

    expect(read('.claude/settings.local.json')).toBe(first);
    expect(JSON.parse(first).hooks.SessionStart).toHaveLength(1);
    expect(fs.readdirSync(path.join(root, '.claude'))).toEqual([
      'settings.local.json',
    ]);
  });

  it('fails without writing for invalid JSON, unexpected shapes and unsupported agents', async () => {
    fs.mkdirSync(path.join(root, '.claude'));
    const file = path.join(root, '.claude/settings.local.json');
    const cases: Array<[string, string]> = [
      ['{ not json', 'is not valid JSON'],
      ['[]', 'must contain a JSON object'],
      ['{"hooks": []}', '"hooks" must be an object'],
      [
        '{"hooks": {"SessionStart": {}}}',
        '"hooks.SessionStart" must be an array',
      ],
      [
        '{"hooks": {"SessionStart": [{"matcher": "a"}]}}',
        'each "hooks.SessionStart" entry must have a "hooks" array',
      ],
    ];
    for (const [content, message] of cases) {
      fs.writeFileSync(file, content);
      await expect(
        installHooks({ ...base(), agents: ['claude-code'] }),
      ).rejects.toThrow(message);
      expect(fs.readFileSync(file, 'utf8')).toBe(content);
    }

    fs.rmSync(file);
    await expect(
      installHooks({ ...base(), agents: ['claude-code', 'cursor'] }),
    ).rejects.toThrow('hooks are not supported for cursor yet');
    expect(fs.existsSync(file)).toBe(false);

    await expect(
      installHooks({ ...base(), agents: ['codex', 'cursor'] }),
    ).rejects.toThrow('hooks are not supported for cursor yet');
    expect(fs.existsSync(path.join(root, '.codex'))).toBe(false);

    for (const instance of ['--evil', 'a b', 'x;y', '']) {
      await expect(
        installHooks({ ...base(), agents: ['claude-code'], instance }),
      ).rejects.toThrow('--instance');
    }
    expect(fs.existsSync(file)).toBe(false);
  });

  it('does not write anything on a dry run but reports the result', async () => {
    const results = await installHooks({
      ...base(),
      agents: ['claude-code'],
      dryRun: true,
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({ written: false });
    expect(results[0].json).toContain(command('claude-code'));
    expect(fs.existsSync(path.join(root, '.claude'))).toBe(false);
  });

  it('adds the file to the git exclude list unless it is already ignored', async () => {
    const exclude = path.join(root, '.git', 'info', 'exclude');
    const fake = (ignored: boolean) =>
      jest.fn(async (_file: string, args: string[]) => {
        if (args.includes('check-ignore')) {
          if (ignored) return { stdout: '' };
          throw Object.assign(new Error('not ignored'), { code: 1 });
        }
        if (args.includes('--git-path')) return { stdout: `${exclude}\n` };
        throw new Error(`unexpected ${args.join(' ')}`);
      });
    fs.mkdirSync(path.dirname(exclude), { recursive: true });
    fs.writeFileSync(exclude, '# existing');

    const ignoredExec = fake(true);
    let [result] = await installHooks({
      ...base(),
      agents: ['claude-code'],
      exec: ignoredExec,
    });
    expect(result.excludedFrom).toBeUndefined();
    expect(fs.readFileSync(exclude, 'utf8')).toBe('# existing');

    const exec = fake(false);
    [result] = await installHooks({
      ...base(),
      agents: ['claude-code'],
      exec,
    });
    expect(result.excludedFrom).toBe(exclude);
    expect(fs.readFileSync(exclude, 'utf8')).toBe(
      '# existing\n/.claude/settings.local.json\n',
    );
    expect(exec).toHaveBeenCalledWith('git', [
      '-C',
      root,
      'check-ignore',
      '-q',
      path.join(root, '.claude', 'settings.local.json'),
    ]);

    // Not inside a git repository: nothing is excluded and nothing fails.
    const notRepo = jest.fn(async () => {
      throw Object.assign(new Error('not a repo'), { code: 128 });
    });
    [result] = await installHooks({
      ...base(),
      agents: ['claude-code'],
      exec: notRepo,
    });
    expect(result.written).toBe(true);
    expect(result.excludedFrom).toBeUndefined();

    // A dry run does not change anything in git.
    const dry = fake(false);
    await installHooks({
      ...base(),
      agents: ['claude-code'],
      dryRun: true,
      exec: dry,
    });
    expect(dry).not.toHaveBeenCalledWith(
      'git',
      expect.arrayContaining(['check-ignore']),
    );
  });

  it('installs the Codex hook next to the Claude Code hook, with a trust reminder and the same replace-in-place behavior', async () => {
    const results = await installHooks({
      ...base(),
      agents: ['claude-code', 'codex'],
      instance: 'prod',
    });

    expect(results.map(r => [r.agent, path.relative(root, r.file)])).toEqual([
      ['claude-code', path.join('.claude', 'settings.local.json')],
      ['codex', path.join('.codex', 'hooks.json')],
    ]);
    expect(results[0].notice).toBeUndefined();
    expect(results[1].notice).toContain('/hooks');
    const first = read('.codex/hooks.json');
    expect(JSON.parse(first)).toEqual({
      hooks: {
        SessionStart: [
          {
            matcher: 'startup|resume',
            hooks: [
              {
                type: 'command',
                command: command('codex', 'prod'),
                timeout: 120,
              },
            ],
          },
        ],
      },
    });

    // Existing hooks and other settings are kept, and our entry is replaced.
    const other = { type: 'command', command: 'echo hi' };
    const parsed = JSON.parse(first);
    parsed.hooks.Stop = [{ hooks: [other] }];
    fs.writeFileSync(
      path.join(root, '.codex/hooks.json'),
      JSON.stringify(parsed),
    );
    await installHooks({ ...base(), agents: ['codex'], instance: 'prod' });
    expect(JSON.parse(read('.codex/hooks.json'))).toEqual(parsed);

    fs.writeFileSync(path.join(root, '.codex/hooks.json'), '{nope');
    await expect(
      installHooks({ ...base(), agents: ['claude-code', 'codex'] }),
    ).rejects.toThrow('.codex/hooks.json');
  });

  it('refuses to modify a hook file that git tracks, before writing anything', async () => {
    const tracked = path.join(root, '.codex', 'hooks.json');
    const exec = jest.fn(async (_file: string, args: string[]) => {
      if (args.includes('ls-files') && args.includes(tracked)) {
        return { stdout: `${tracked}\n` };
      }
      throw Object.assign(new Error('nope'), { code: 1 });
    });

    await expect(
      installHooks({ ...base(), agents: ['claude-code', 'codex'], exec }),
    ).rejects.toThrow(/\.codex\/hooks\.json is tracked by git/);
    expect(fs.existsSync(path.join(root, '.claude'))).toBe(false);
    expect(fs.existsSync(tracked)).toBe(false);
    expect(exec).toHaveBeenCalledWith('git', [
      '-C',
      root,
      'ls-files',
      '--error-unmatch',
      '--',
      tracked,
    ]);
  });

  it('adds the Codex hook file to the git exclude list', async () => {
    const exclude = path.join(root, '.git', 'info', 'exclude');
    const exec = jest.fn(async (_file: string, args: string[]) => {
      if (args.includes('--git-path')) return { stdout: `${exclude}\n` };
      throw Object.assign(new Error('no'), { code: 1 });
    });
    const [result] = await installHooks({ ...base(), agents: ['codex'], exec });
    expect(result.excludedFrom).toBe(exclude);
    expect(fs.readFileSync(exclude, 'utf8')).toBe('/.codex/hooks.json\n');
  });
});
