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
 * This script checks that the agent skills in .agents/skills are consistent:
 * each skill's SKILL.md name matches its directory, and each skill listed in
 * index.json, which are the ones published to backstage.io, has the same
 * description and files as its directory. Unlisted skills are only used
 * within this repository.
 *
 * It can be run with a `--fix` flag to automatically fix index.json.
 */

const skillsDir = resolvePath(__dirname, '../.agents/skills');
const indexPath = joinPath(skillsDir, 'index.json');

function readFrontMatter(skillFile) {
  const content = fs.readFileSync(skillFile, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? parseYaml(match[1]) ?? {} : {};
}

async function main(args) {
  const shouldFix = args.includes('--fix');
  const errors = [];
  const fixable = [];

  const skills = new Map();
  for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const name = entry.name;
    const skillFile = joinPath(skillsDir, name, 'SKILL.md');
    if (!fs.existsSync(skillFile)) {
      errors.push(`.agents/skills/${name} has no SKILL.md`);
      continue;
    }
    const frontMatter = readFrontMatter(skillFile);
    if (frontMatter.name !== name || !frontMatter.description) {
      errors.push(
        `.agents/skills/${name}/SKILL.md must have name '${name}' and a description`,
      );
    }
    const files = fs
      .readdirSync(joinPath(skillsDir, name), {
        recursive: true,
        withFileTypes: true,
      })
      .filter(file => file.isFile())
      .map(file =>
        relativePath(
          joinPath(skillsDir, name),
          joinPath(file.parentPath, file.name),
        ).replaceAll('\\', '/'),
      );
    skills.set(name, {
      description: String(frontMatter.description ?? '')
        .replace(/\s+/g, ' ')
        .trim(),
      files: ['SKILL.md', ...files.filter(f => f !== 'SKILL.md').sort()],
    });
  }

  const index = await fs.readJson(indexPath);
  index.skills = index.skills.filter(entry => {
    if (skills.has(entry.name)) {
      return true;
    }
    fixable.push(`index.json lists '${entry.name}', which does not exist`);
    return false;
  });
  for (const entry of index.skills) {
    const skill = skills.get(entry.name);
    if (entry.description !== skill.description) {
      fixable.push(
        `index.json description for '${entry.name}' does not match its SKILL.md`,
      );
      entry.description = skill.description;
    }
    const files = entry.files ?? [];
    if (
      files.length !== skill.files.length ||
      !skill.files.every(f => files.includes(f))
    ) {
      fixable.push(
        `index.json files for '${entry.name}' do not match its directory`,
      );
      entry.files = skill.files;
    }
  }

  if (shouldFix && fixable.length) {
    await fs.writeFile(
      indexPath,
      await prettier.format(JSON.stringify(index, null, 2), {
        filepath: indexPath,
      }),
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
