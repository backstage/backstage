#!/usr/bin/env node
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

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { getValidComponents } = require('./get-valid-components');

/**
 * Create readline interface for user input
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * Ask a question and return the answer
 */
function question(rl, prompt) {
  return new Promise(resolve => {
    rl.question(prompt, answer => {
      resolve(answer);
    });
  });
}

/**
 * Display a single-select menu using arrow keys
 */
async function singleSelect(items, prompt, descriptions = {}) {
  return new Promise(resolve => {
    let currentIndex = 0;

    // Hide cursor
    process.stdout.write('\x1B[?25l');

    const render = () => {
      // Clear previous output
      readline.cursorTo(process.stdout, 0);
      process.stdout.write('\x1Bc'); // Clear screen

      console.log(prompt);
      console.log('(Use ↑/↓ arrows to navigate, Enter to confirm)\n');

      items.forEach((item, index) => {
        const isCurrent = index === currentIndex;
        const arrow = isCurrent ? '❯' : ' ';
        const color = isCurrent ? '\x1b[36m' : '\x1b[0m'; // Cyan for current
        const description = descriptions[item]
          ? `\x1b[90m - ${descriptions[item]}\x1b[0m`
          : '';

        console.log(`${color}${arrow} ${item}${description}\x1b[0m`);
      });
    };

    const handleKeypress = (str, key) => {
      if (key.name === 'up' && currentIndex > 0) {
        currentIndex--;
        render();
      } else if (key.name === 'down' && currentIndex < items.length - 1) {
        currentIndex++;
        render();
      } else if (key.name === 'return') {
        // Show cursor again
        process.stdout.write('\x1B[?25h');
        process.stdin.setRawMode(false);
        process.stdin.removeListener('keypress', handleKeypress);
        readline.emitKeypressEvents(process.stdin);
        console.log('\n');
        resolve(items[currentIndex]);
      } else if (key.ctrl && key.name === 'c') {
        process.stdout.write('\x1B[?25h');
        process.exit(0);
      }
    };

    // Enable raw mode for keypress detection
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.on('keypress', handleKeypress);

    render();
  });
}

/**
 * Display a multi-select menu using arrow keys
 */
async function multiSelect(items, prompt) {
  return new Promise(resolve => {
    const selected = new Set();
    let currentIndex = 0;

    // Hide cursor
    process.stdout.write('\x1B[?25l');

    const render = () => {
      // Clear previous output
      readline.cursorTo(process.stdout, 0);
      process.stdout.write('\x1Bc'); // Clear screen

      console.log(prompt);
      console.log(
        '(Use ↑/↓ arrows to navigate, Space to select, Enter to confirm)\n',
      );

      items.forEach((item, index) => {
        const isSelected = selected.has(item);
        const isCurrent = index === currentIndex;
        const checkbox = isSelected ? '◉' : '○';
        const arrow = isCurrent ? '❯' : ' ';
        const color = isCurrent ? '\x1b[36m' : '\x1b[0m'; // Cyan for current

        console.log(`${color}${arrow} ${checkbox} ${item}\x1b[0m`);
      });

      console.log(
        `\nSelected: ${
          selected.size > 0 ? Array.from(selected).join(', ') : '(none)'
        }`,
      );
    };

    const handleKeypress = (str, key) => {
      if (key.name === 'up' && currentIndex > 0) {
        currentIndex--;
        render();
      } else if (key.name === 'down' && currentIndex < items.length - 1) {
        currentIndex++;
        render();
      } else if (key.name === 'space') {
        const item = items[currentIndex];
        if (selected.has(item)) {
          selected.delete(item);
        } else {
          selected.add(item);
        }
        render();
      } else if (key.name === 'return') {
        // Show cursor again
        process.stdout.write('\x1B[?25h');
        process.stdin.setRawMode(false);
        process.stdin.removeListener('keypress', handleKeypress);
        readline.emitKeypressEvents(process.stdin);
        console.log('\n');
        resolve(Array.from(selected));
      } else if (key.ctrl && key.name === 'c') {
        process.stdout.write('\x1B[?25h');
        process.exit(0);
      }
    };

    // Enable raw mode for keypress detection
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.on('keypress', handleKeypress);

    render();
  });
}

/**
 * Generate a random changeset filename
 */
function generateChangesetFilename() {
  const adjectives = [
    'happy',
    'sad',
    'friendly',
    'brave',
    'calm',
    'clever',
    'cool',
    'eager',
    'fair',
    'fancy',
    'gentle',
    'good',
    'kind',
    'lazy',
    'nice',
    'proud',
    'silly',
    'wise',
    'witty',
    'young',
  ];
  const nouns = [
    'foxes',
    'dogs',
    'cats',
    'birds',
    'lions',
    'tigers',
    'bears',
    'wolves',
    'deer',
    'rabbits',
    'ducks',
    'geese',
    'sheep',
    'cows',
    'horses',
    'pigs',
    'goats',
    'mice',
    'rats',
    'owls',
  ];
  const verbs = [
    'jump',
    'run',
    'walk',
    'swim',
    'fly',
    'dance',
    'sing',
    'play',
    'sleep',
    'eat',
    'drink',
    'laugh',
    'smile',
    'work',
    'rest',
    'move',
    'stop',
    'start',
    'help',
    'learn',
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];

  return `${adj}-${noun}-${verb}.md`;
}

/**
 * Create a standard changeset file (without metadata)
 */
function createChangesetFile(bumpType, description, migration) {
  const changesetDir = path.join(__dirname, '../../.changeset');
  const filename = generateChangesetFilename();
  const filePath = path.join(changesetDir, filename);

  // Build standard frontmatter (just package and bump type)
  const frontmatter = `'@backstage/ui': ${bumpType}`;

  // Build full description with migration notes if provided
  let fullDescription = description;
  if (migration) {
    fullDescription += `\n\n## Migration\n\n${migration}`;
  }

  const content = `---\n${frontmatter}\n---\n\n${fullDescription}\n`;

  fs.writeFileSync(filePath, content, 'utf-8');

  return filename;
}

/**
 * Add entry to next.ts (unreleased changes)
 */
function addToNextChangelog(components, description, bumpType) {
  const changelogsDir = path.join(
    __dirname,
    '../../docs-ui/src/utils/changelogs',
  );

  const filePath = path.join(changelogsDir, 'next.ts');

  // Infer type from bump type and description
  let type = undefined;
  if (bumpType === 'major' || bumpType === 'minor') {
    type = 'breaking';
  } else if (description.match(/^(New|Add(ed)?)\s/i)) {
    type = 'new';
  } else if (bumpType === 'patch') {
    type = 'fix';
  }

  // Build TypeScript content
  const componentsStr = `[${components.map(c => `'${c}'`).join(', ')}]`;
  const descEscaped = description
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');
  const typeStr = type ? `    type: '${type}',\n` : '';

  const entryContent = `  {
    components: ${componentsStr},
    version: 'next',
    description: \`${descEscaped}\`,
${typeStr}  }`;

  let content;
  if (fs.existsSync(filePath)) {
    // Append to existing file
    const existingContent = fs.readFileSync(filePath, 'utf-8');
    const insertPoint = existingContent.lastIndexOf('];');
    content = `${existingContent.slice(0, insertPoint)},\n${entryContent}\n];`;
    console.log('   Appended to existing next.ts');
  } else {
    // Create new file
    content = `import type { ChangelogProps } from '../types';

export const changelogNext: ChangelogProps[] = [
${entryContent}
];
`;
    console.log('   Created new next.ts');
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  return 'next.ts';
}

/**
 * Ensure next.ts is imported in changelog.ts
 */
function ensureNextImported() {
  const changelogPath = path.join(
    __dirname,
    '../../docs-ui/src/utils/changelog.ts',
  );

  const content = fs.readFileSync(changelogPath, 'utf-8');

  // Check if next is already imported
  if (content.includes('changelogNext')) {
    return; // Already imported
  }

  // Add import at the top (after "export * from './types';")
  const importLine = `import { changelogNext } from './changelogs/next';`;
  const updatedContent = content.replace(
    /(export \* from ['"]\.\/types['"];)/,
    `$1\n${importLine}`,
  );

  // Add to the changelog array (at the beginning)
  const spreadLine = `  ...changelogNext,`;
  const finalContent = updatedContent.replace(
    /(export const changelog = \[)/,
    `$1\n${spreadLine}`,
  );

  fs.writeFileSync(changelogPath, finalContent, 'utf-8');
  console.log('   Added next.ts to changelog.ts');
}

/**
 * Multi-line input for migration notes
 */
async function multilineInput(rl, prompt) {
  console.log(prompt);
  console.log(
    '(Enter your migration notes. Type "done" on a new line when finished, or "skip" to skip)\n',
  );

  const lines = [];
  let collecting = true;

  while (collecting) {
    const line = await question(rl, '');
    if (line.trim().toLowerCase() === 'done') {
      collecting = false;
    } else if (line.trim().toLowerCase() === 'skip') {
      return null;
    } else {
      lines.push(line);
    }
  }

  return lines.join('\n');
}

/**
 * Main function
 */
async function main() {
  console.log('\n🎨 Backstage UI Changeset Creator\n');

  // Get valid components
  let validComponents;
  try {
    validComponents = getValidComponents();
  } catch (error) {
    console.error('❌ Error loading valid components:', error.message);
    console.error(
      '   Make sure docs-ui/src/utils/types.ts exists and is properly formatted.\n',
    );
    process.exit(1);
  }

  // Select bump type
  const bumpType = await singleSelect(
    ['patch', 'minor', 'major'],
    '📊 What type of change is this?',
    {
      patch: 'Bug fixes, small improvements',
      minor: 'New features, breaking changes (for 0.x)',
      major: 'Breaking changes (for 1.x+)',
    },
  );

  console.log(`Selected: ${bumpType}\n`);

  // Multi-select components
  const selectedComponents = await multiSelect(
    validComponents,
    '📦 Select the components affected by this change:',
  );

  if (selectedComponents.length === 0) {
    console.log('❌ You must select at least one component.');
    process.exit(1);
  }

  console.log(`Selected: ${selectedComponents.join(', ')}\n`);

  // Get description
  const rl = createInterface();

  const description = await question(
    rl,
    '📝 Enter a brief description of the change:\n   ',
  );

  if (!description.trim()) {
    console.log('\n❌ Description cannot be empty.');
    rl.close();
    process.exit(1);
  }

  // Ask for migration notes
  const needsMigration = await question(
    rl,
    '\n📋 Does this change require migration notes? (y/N): ',
  );

  let migrationNotes = null;
  if (
    needsMigration.toLowerCase() === 'y' ||
    needsMigration.toLowerCase() === 'yes'
  ) {
    migrationNotes = await multilineInput(rl, '\n✍️  Enter migration notes:');
  }

  rl.close();

  // Create the changeset file
  try {
    const filename = createChangesetFile(
      bumpType,
      description.trim(),
      migrationNotes,
    );

    // Add to next.ts
    const changelogFilename = addToNextChangelog(
      selectedComponents,
      description.trim(),
      bumpType,
    );

    // Ensure next.ts is imported
    ensureNextImported();

    console.log('\n✅ Changeset created successfully!');
    console.log(`   Changeset: .changeset/${filename}`);
    console.log(
      `   Changelog: docs-ui/src/utils/changelogs/${changelogFilename}`,
    );
    console.log(`   Type: ${bumpType}`);
    console.log(`   Components: ${selectedComponents.join(', ')}`);
    if (migrationNotes) {
      console.log('   Migration notes: Added inline');
    }
    console.log('\n💡 Tip: Review both files before committing.\n');
  } catch (error) {
    console.error('❌ Error creating files:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}
