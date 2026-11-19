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

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const CATCH_UP_MESSAGE = 'Bumped version to account for a patch release.';
const MOVE_PAST_MESSAGE =
  'Bumped version to move past a patch release from an older release line.';

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

/**
 * Creates a repository with a bare remote, where each package lives in
 * `packages/<name>` and is published as `@backstage/<name>`.
 */
function createRepo(t) {
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'backstage-prepare-release-'),
  );
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));

  const repoDir = path.join(tempDir, 'repo');
  const remoteDir = path.join(tempDir, 'remote.git');
  fs.mkdirSync(repoDir);

  const git = (...args) =>
    execFileSync('git', args, { cwd: repoDir, stdio: 'ignore' });

  git('init', '--initial-branch=master');
  git('config', 'user.name', 'Test');
  git('config', 'user.email', 'test@example.com');
  git('init', '--bare', remoteDir);
  git('remote', 'add', 'origin', remoteDir);
  fs.mkdirSync(path.join(repoDir, '.changeset'));
  fs.writeFileSync(path.join(repoDir, '.changeset/README.md'), '');

  const packagePath = (name, file) =>
    path.join(repoDir, 'packages', name, file);

  return {
    git,
    enterPreRelease(initialVersions) {
      writeJson(path.join(repoDir, '.changeset/pre.json'), {
        mode: 'pre',
        tag: 'next',
        initialVersions,
        changesets: [],
      });
    },
    setRelease(version) {
      writeJson(path.join(repoDir, 'package.json'), {
        name: 'root',
        private: true,
        version,
        workspaces: ['packages/*'],
      });
    },
    setPackage(name, version) {
      writeJson(packagePath(name, 'package.json'), {
        name: `@backstage/${name}`,
        version,
      });
      if (!fs.existsSync(packagePath(name, 'CHANGELOG.md'))) {
        fs.writeFileSync(
          packagePath(name, 'CHANGELOG.md'),
          `# @backstage/${name}\n`,
        );
      }
    },
    commit(message) {
      git('add', '.');
      git('commit', '-m', message);
    },
    // Creates a patch branch for a release and publishes it to the remote
    pushPatchBranch(release, versions) {
      git('switch', '-c', `patch/v${release}`, `v${release}`);
      for (const [name, version] of Object.entries(versions)) {
        this.setPackage(name, version);
      }
      this.commit(`patch release of ${release}`);
      git('push', 'origin', `patch/v${release}`);
      git('switch', 'master');
    },
    run() {
      fs.mkdirSync(path.join(repoDir, 'scripts'), { recursive: true });
      fs.copyFileSync(
        path.resolve(__dirname, 'prepare-release.js'),
        path.join(repoDir, 'scripts/prepare-release.js'),
      );
      this.commit('prepare release');
      execFileSync(
        process.execPath,
        [path.join(repoDir, 'scripts/prepare-release.js')],
        {
          cwd: repoDir,
          env: {
            ...process.env,
            NODE_PATH: path.resolve(__dirname, '../node_modules'),
          },
          stdio: 'ignore',
        },
      );
    },
    readVersion(name) {
      return JSON.parse(fs.readFileSync(packagePath(name, 'package.json')))
        .version;
    },
    readChangelog(name) {
      return fs.readFileSync(packagePath(name, 'CHANGELOG.md'), 'utf8');
    },
  };
}

test('accounts for patches from the current and older release lines', t => {
  const repo = createRepo(t);

  repo.setRelease('1.0.0');
  for (const name of ['older', 'current', 'both', 'ahead']) {
    repo.setPackage(name, '1.0.0');
  }
  repo.commit('release 1.0.0');
  repo.git('tag', 'v1.0.0');

  repo.setRelease('1.1.0');
  repo.setPackage('ahead', '1.1.0');
  repo.setPackage('added', '0.1.0');
  repo.commit('release 1.1.0');
  repo.git('tag', 'v1.1.0');

  // The older line is patched after the current release is out, including a
  // package that was added on the patch branch with the same version that the
  // current release ended up carrying.
  repo.pushPatchBranch('1.0.0', {
    older: '1.0.1',
    both: '1.0.1',
    ahead: '1.0.1',
    added: '0.1.0',
  });
  repo.pushPatchBranch('1.1.0', { current: '1.0.1', both: '1.0.1' });

  // Branches that are not named after a release are ignored
  repo.git('switch', '-c', 'patch/vnext', 'v1.1.0');
  repo.setPackage('current', '9.9.9');
  repo.commit('not a release');
  repo.git('push', 'origin', 'patch/vnext');
  repo.git('switch', 'master');

  repo.run();

  // Moves past patches from the older line, even at the same version
  assert.equal(repo.readVersion('older'), '1.0.2');
  assert.equal(repo.readVersion('added'), '0.1.1');
  assert.match(repo.readChangelog('older'), /## 1\.0\.2\n/);
  assert.ok(repo.readChangelog('older').includes(MOVE_PAST_MESSAGE));

  // Catches up to patches from the current line
  assert.equal(repo.readVersion('current'), '1.0.1');
  assert.ok(repo.readChangelog('current').includes(CATCH_UP_MESSAGE));

  // Moves past a version published from both lines, since one of the builds
  // is from the older line
  assert.equal(repo.readVersion('both'), '1.0.2');

  // Leaves packages that are already ahead of the patch alone
  assert.equal(repo.readVersion('ahead'), '1.1.0');
  assert.equal(repo.readChangelog('ahead'), '# @backstage/ahead\n');
});

test('keeps the pre-release sequence when accounting for patches', t => {
  const repo = createRepo(t);

  repo.setRelease('1.0.0');
  repo.setPackage('older', '1.0.0');
  repo.commit('release 1.0.0');
  repo.git('tag', 'v1.0.0');

  repo.setRelease('1.1.0');
  repo.setPackage('current', '1.0.0');
  repo.commit('release 1.1.0');
  repo.git('tag', 'v1.1.0');

  repo.pushPatchBranch('1.0.0', { older: '1.0.1', added: '0.1.0' });
  repo.pushPatchBranch('1.1.0', { current: '1.0.1' });

  repo.setRelease('1.2.0-next.0');
  repo.setPackage('older', '1.0.1-next.0');
  repo.setPackage('current', '1.0.1-next.0');
  repo.setPackage('added', '0.1.0-next.1');
  repo.enterPreRelease({
    '@backstage/older': '1.0.0',
    '@backstage/current': '1.0.0',
  });
  repo.run();

  assert.equal(repo.readVersion('older'), '1.0.2-next.0');
  assert.ok(repo.readChangelog('older').includes(MOVE_PAST_MESSAGE));
  assert.equal(repo.readVersion('added'), '0.1.1-next.1');
  assert.equal(repo.readVersion('current'), '1.0.2-next.0');
  assert.match(
    repo.readChangelog('current'),
    /## 1\.0\.2-next\.0\n\n### Patch Changes\n\n- Bumped version to account for a patch release\./,
  );
});
