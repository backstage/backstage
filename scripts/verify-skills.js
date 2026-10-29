#!/usr/bin/env node
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

const fs = require('fs-extra');
const prettier = require('prettier');
const { parse: parseYaml } = require('yaml');
const {
  resolve: resolvePath,
  join: joinPath,
  relative: relativePath,
} = require('node:path');

/**
 * This script checks that agent skills are set up consistently:
 *
 * - Every published skill in docs/.well-known/skills has a SKILL.md whose
 *   name matches its directory, and an up-to-date entry in index.json.
 * - Every published skill is symlinked into .claude/skills, so that agents
 *   working in this repo can find it, and there are no stale symlinks.
 * - Every skill in .claude/skills is a <name>/SKILL.md directory.
 * - .agents/skills is a symlink to .claude/skills.
 *
 * It can be run with a `--fix` flag to automatically fix the symlinks and
 * index.json.
 */

const rootDir = resolvePath(__dirname, '..');
const publishedDir = joinPath(rootDir, 'docs/.well-known/skills');
const indexPath = joinPath(publishedDir, 'index.json');
const repoSkillsDir = joinPath(rootDir, '.claude/skills');
const agentsSkillsLink = joinPath(rootDir, '.agents/skills');

function readFrontMatter(skillFile) {
  const content = fs.readFileSync(skillFile, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? parseYaml(match[1]) ?? {} : {};
}

function listFiles(dir) {
  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry =>
      relativePath(dir, joinPath(entry.parentPath, entry.name)).replaceAll(
        '\\',
        '/',
      ),
    );
}

function readLink(path) {
  try {
    return fs.readlinkSync(path).replaceAll('\\', '/');
  } catch {
    return undefined;
  }
}

async function main(args) {
  const shouldFix = args.includes('--fix');
  const errors = [];
  const fixable = [];

  // Published skills
  const published = fs
    .readdirSync(publishedDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();

  const skills = new Map();
  for (const name of published) {
    const skillFile = joinPath(publishedDir, name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      errors.push(`docs/.well-known/skills/${name} has no SKILL.md`);
      continue;
    }
    const frontMatter = readFrontMatter(skillFile);
    if (frontMatter.name !== name) {
      errors.push(
        `docs/.well-known/skills/${name}/SKILL.md has name '${frontMatter.name}', expected '${name}'`,
      );
    }
    if (!frontMatter.description) {
      errors.push(
        `docs/.well-known/skills/${name}/SKILL.md has no description`,
      );
    }
    const files = listFiles(joinPath(publishedDir, name));
    skills.set(name, {
      description: String(frontMatter.description ?? '')
        .replace(/\s+/g, ' ')
        .trim(),
      files: ['SKILL.md', ...files.filter(f => f !== 'SKILL.md').sort()],
    });
  }

  // index.json
  const index = await fs.readJson(indexPath);
  const entries = index.skills.filter(entry => {
    if (skills.has(entry.name)) {
      return true;
    }
    fixable.push(`index.json lists '${entry.name}', which does not exist`);
    return false;
  });
  for (const [name, skill] of skills) {
    const entry = entries.find(e => e.name === name);
    if (!entry) {
      fixable.push(`index.json is missing '${name}'`);
      entries.push({ name, ...skill });
      continue;
    }
    if (entry.description !== skill.description) {
      fixable.push(
        `index.json description for '${name}' does not match its SKILL.md`,
      );
      entry.description = skill.description;
    }
    const sameFiles =
      entry.files.length === skill.files.length &&
      skill.files.every(f => entry.files.includes(f));
    if (!sameFiles) {
      fixable.push(`index.json files for '${name}' do not match its directory`);
      entry.files = skill.files;
    }
  }

  // .claude/skills
  for (const entry of fs.readdirSync(repoSkillsDir, { withFileTypes: true })) {
    const path = joinPath(repoSkillsDir, entry.name);
    const link = readLink(path);
    if (link) {
      const target = `../../docs/.well-known/skills/${entry.name}`;
      if (link !== target || !skills.has(entry.name)) {
        fixable.push(
          `.claude/skills/${entry.name} links to '${link}', which is not a published skill`,
        );
        if (shouldFix) {
          fs.removeSync(path);
        }
      }
    } else if (!entry.isDirectory()) {
      errors.push(
        `.claude/skills/${entry.name} must be a directory with a SKILL.md file`,
      );
    } else if (!fs.existsSync(joinPath(path, 'SKILL.md'))) {
      errors.push(`.claude/skills/${entry.name} has no SKILL.md`);
    } else if (skills.has(entry.name)) {
      errors.push(
        `.claude/skills/${entry.name} has the same name as a published skill`,
      );
    } else if (
      readFrontMatter(joinPath(path, 'SKILL.md')).name !== entry.name
    ) {
      errors.push(
        `.claude/skills/${entry.name}/SKILL.md name does not match its directory`,
      );
    }
  }
  for (const name of skills.keys()) {
    const path = joinPath(repoSkillsDir, name);
    const target = `../../docs/.well-known/skills/${name}`;
    if (readLink(path) !== target && !fs.existsSync(path)) {
      fixable.push(`.claude/skills/${name} is missing a symlink to ${target}`);
      if (shouldFix) {
        fs.symlinkSync(target, path, 'dir');
      }
    }
  }

  // .agents/skills
  if (readLink(agentsSkillsLink) !== '../.claude/skills') {
    fixable.push('.agents/skills must be a symlink to ../.claude/skills');
    if (shouldFix) {
      fs.removeSync(agentsSkillsLink);
      fs.ensureDirSync(joinPath(rootDir, '.agents'));
      fs.symlinkSync('../.claude/skills', agentsSkillsLink, 'dir');
    }
  }

  if (shouldFix && fixable.length) {
    const json = JSON.stringify({ ...index, skills: entries }, null, 2);
    await fs.writeFile(
      indexPath,
      await prettier.format(json, { filepath: indexPath }),
    );
  }

  const reported = shouldFix ? errors : [...errors, ...fixable];
  for (const message of reported) {
    console.error(message);
  }
  if (!shouldFix && fixable.length) {
    console.error();
    console.error('Run `node scripts/verify-skills.js --fix` to fix');
  }
  if (reported.length) {
    process.exit(2);
  }
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
