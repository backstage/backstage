#!/usr/bin/env node
/* eslint-disable no-restricted-syntax */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Compare two semantic versions for sorting.
 * Returns: 1 if versionA > versionB, -1 if versionA < versionB, 0 if equal
 * Example: compareVersions("0.11.0", "0.10.0") => 1
 */
function compareVersions(versionA, versionB) {
  // Strip 'v' prefix if present
  versionA = versionA.replace(/^v/, '');
  versionB = versionB.replace(/^v/, '');

  // Compare major.minor.patch versions
  const versionAParts = versionA.split('.').map(Number);
  const versionBParts = versionB.split('.').map(Number);

  for (
    let i = 0;
    i < Math.max(versionAParts.length, versionBParts.length);
    i++
  ) {
    const versionAPart = versionAParts[i] || 0;
    const versionBPart = versionBParts[i] || 0;

    if (versionAPart > versionBPart) return 1;
    if (versionAPart < versionBPart) return -1;
  }

  return 0;
}

/**
 * Check if versionA is newer than versionB
 */
function isNewerVersion(versionA, versionB) {
  return compareVersions(versionA, versionB) > 0;
}

/**
 * Read the existing changelog.ts and find the highest version number
 * by scanning the changelogs/ directory for version files
 */
function getLastSyncedVersion(changelogPath) {
  try {
    // Scan changelogs/ directory for latest version file
    const changelogsDir = path.join(path.dirname(changelogPath), 'changelogs');

    if (!fs.existsSync(changelogsDir)) {
      return null;
    }

    // Read all version files (v0.1.0.ts, v0.2.0.ts, etc.)
    const files = fs
      .readdirSync(changelogsDir)
      .filter(f => f.match(/^v\d+\.\d+\.\d+\.ts$/))
      .map(f => f.replace(/^v/, '').replace(/\.ts$/, ''));

    if (files.length === 0) {
      return null;
    }

    // Find highest version
    let highest = files[0];
    for (const version of files) {
      if (compareVersions(version, highest) > 0) {
        highest = version;
      }
    }

    return highest;
  } catch (error) {
    console.error(`Error reading changelog file: ${error.message}`);
    return null;
  }
}

/**
 * Convert PascalCase component name to kebab-case slug
 * Avatar -> avatar
 * ButtonIcon -> button-icon
 * SearchField -> searchfield (special case per existing data)
 */
function pascalToKebab(str) {
  // Special cases observed in changelog.ts
  const specialCases = {
    SearchField: 'searchfield',
    TextField: 'textfield',
    DataTable: 'datatable',
    ScrollArea: 'scrollarea',
  };

  if (specialCases[str]) {
    return specialCases[str];
  }

  // General conversion: insert hyphen before uppercase letters
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, ''); // Remove leading hyphen
}

/**
 * Map component name to valid Component type slug
 * Returns null if component not recognized
 */
function mapComponentName(name, validComponents) {
  const kebab = pascalToKebab(name.trim());
  const kebabLower = kebab.toLowerCase();

  // Check if it's a valid component
  const valid = validComponents.find(c => c.toLowerCase() === kebabLower);

  return valid || null;
}

/**
 * Get valid component names from types.ts Component type
 */
function getValidComponents(changelogPath) {
  // Read from types.ts instead of changelog.ts
  const typesPath = changelogPath.replace('changelog.ts', 'types.ts');
  const content = fs.readFileSync(typesPath, 'utf-8');

  // Extract Component type union
  const typeMatch = content.match(/export type Component =([^;]+);/s);
  if (!typeMatch) {
    throw new Error('Could not find Component type definition');
  }

  // Extract string literals from the union
  const components = typeMatch[1]
    .match(/['"]([^'"]+)['"]/g)
    .map(s => s.replace(/['"]/g, ''));

  return components;
}

/**
 * Parse CHANGELOG.md and extract entries newer than sinceVersion
 * Only processes main release versions (e.g., 0.11.0), skips pre-releases (e.g., 0.11.0-next.1)
 */
async function parseChangelogMd(changelogPath, sinceVersion, validComponents) {
  const content = fs.readFileSync(changelogPath, 'utf-8');
  const tree = unified().use(remarkParse).parse(content);

  const entries = [];
  let currentVersion = null;
  let currentSection = null; // 'Minor Changes', 'Patch Changes', 'Major Changes'
  let processedCount = 0;

  // Walk through the markdown AST
  async function walk(node, depth = 0) {
    // Version headers (## 0.11.0)
    if (node.type === 'heading' && node.depth === 2) {
      const versionText = extractText(node).trim();
      // Only process main release versions (X.Y.Z format)
      if (/^\d+\.\d+\.\d+$/.test(versionText)) {
        currentVersion = versionText;
        currentSection = null;
      } else {
        // Skip pre-release versions (e.g., 0.11.0-next.1) and non-version headings
        currentVersion = null;
        currentSection = null;
      }
      return;
    }

    // Section headers (### Minor Changes)
    if (node.type === 'heading' && node.depth === 3) {
      const sectionText = extractText(node);
      currentSection = sectionText.trim();
      return;
    }

    // List items (- 539cf26: description)
    if (node.type === 'listItem' && currentVersion && currentSection) {
      // Only process if version is newer than sinceVersion
      if (!sinceVersion || isNewerVersion(currentVersion, sinceVersion)) {
        const entry = await parseListItem(
          node,
          currentVersion,
          currentSection,
          validComponents,
          content,
        );
        if (entry) {
          entries.push(entry);
          processedCount++;
          // Progress logging every 50 entries
          if (processedCount % 50 === 0) {
            process.stdout.write(`\r   Processed ${processedCount} entries...`);
          }
        }
      }
    }

    // Recurse into children
    if (node.children) {
      for (const child of node.children) {
        await walk(child, depth + 1);
      }
    }
  }

  await walk(tree);

  // Clear progress line
  if (processedCount > 0) {
    process.stdout.write(`\r   Processed ${processedCount} entries - done!\n`);
  }

  return entries;
}

/**
 * Extract plain text from a markdown node
 */
function extractText(node) {
  if (node.type === 'text') {
    return node.value;
  }
  if (node.children) {
    return node.children.map(extractText).join('');
  }
  return '';
}

/**
 * Extract raw markdown content from a node using position offsets
 * This preserves all formatting: code blocks, lists, bold/italic, etc.
 */
function extractMarkdown(node, sourceText) {
  if (!node.position) {
    return extractText(node); // Fallback to text extraction
  }

  const start = node.position.start.offset;
  const end = node.position.end.offset;

  if (start === undefined || end === undefined) {
    return extractText(node);
  }

  return sourceText.slice(start, end).trim();
}

/**
 * Parse a list item to extract changelog entry
 * NOTE: PR numbers are NOT fetched here - they're fetched later only for new entries
 */
async function parseListItem(
  node,
  version,
  section,
  validComponents,
  sourceText,
) {
  // Extract the full text content for SHA parsing
  const fullText = extractText(node);

  // Parse commit SHA and description
  // Format: "- 539cf26: description..."
  const match = fullText.match(/^-?\s*([a-f0-9]+):\s*(.+)/s);
  if (!match) {
    return null;
  }

  const commitSha = match[1];

  // Extract full markdown content from the list item
  let fullMarkdown = extractMarkdown(node, sourceText);

  // Remove the commit SHA prefix from markdown
  let description = fullMarkdown.replace(/^-?\s*[a-f0-9]+:\s*/, '').trim();

  // Extract components using bold marker (standard format)
  let components = [];
  const componentMatch = description.match(
    /\*\*Affected components:\*\*\s*([^\n]+)/,
  );
  if (componentMatch) {
    const componentNames = componentMatch[1]
      .split(',')
      .map(name => name.trim())
      .filter(Boolean);

    components = componentNames
      .map(name => mapComponentName(name, validComponents))
      .filter(Boolean);

    // Strip "**Affected components:**" line from description
    description = description
      .replace(/\n*\*\*Affected components:\*\*[ \t]*[^\n]+/g, '')
      .trim();
  }

  // Extract migration notes using bold marker (standard format)
  let migration = null;
  const migrationMatch = description.match(
    /\*\*Migration:\*\*\s*\n([\s\S]+?)(?=\n\s*$|$)/,
  );
  if (migrationMatch) {
    // Clean up indentation from list format (remove leading 2 spaces from each line)
    migration = migrationMatch[1]
      .split('\n')
      .map(line => line.replace(/^  /, ''))
      .join('\n')
      .trim();
    // Strip migration section from description
    description = description
      .replace(/\n*\*\*Migration:\*\*[\s\S]+$/, '')
      .trim();
  }

  const prs = []; // Will be populated later by fetchPRNumbers()

  // Check if this is a breaking change
  const breaking = isBreakingChange(section, description, version);

  return {
    version,
    section,
    commitSha,
    description,
    components,
    prs,
    breaking,
    migration,
  };
}

/**
 * Determine if a change is breaking based on semver rules
 * Breaking change rules (semver):
 * - version >= 1.0.0: Major changes are breaking
 * - version < 1.0.0: Major and Minor changes are breaking
 */
function isBreakingChange(section, description, version) {
  // Parse version to determine breaking change rules based on semver
  const [major] = version.split('.').map(Number);

  // Version >= 1.0.0: Only Major Changes are breaking
  if (major >= 1) {
    return section === 'Major Changes';
  }

  // Version < 1.0.0: Both Major and Minor Changes are breaking
  return section === 'Major Changes' || section === 'Minor Changes';
}

/**
 * Generate new changelog entries and update changelog.ts
 */
/**
 * Fetch PR numbers for entries that need them
 * Only fetches for entries with empty prs array (new entries)
 */
async function fetchPRNumbers(entries, dryRun = false) {
  const entriesNeedingPRs = entries.filter(
    e => e.prs.length === 0 && e.commitSha,
  );

  if (entriesNeedingPRs.length === 0) {
    return;
  }

  console.log(
    `\n🔍 Fetching PR numbers for ${entriesNeedingPRs.length} new entries...`,
  );

  let fetchedCount = 0;
  const startTime = Date.now();

  for (const entry of entriesNeedingPRs) {
    const prNumber = await findPRNumber(entry.commitSha);
    if (prNumber) {
      entry.prs.push(prNumber);
    }

    fetchedCount++;
    // Progress every 10 lookups
    if (fetchedCount % 10 === 0 || fetchedCount === entriesNeedingPRs.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = ((fetchedCount / (Date.now() - startTime)) * 1000).toFixed(
        1,
      );
      process.stdout.write(
        `\r   Fetched ${fetchedCount}/${entriesNeedingPRs.length} PR numbers (${elapsed}s, ~${rate} req/s)`,
      );
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const foundCount = entriesNeedingPRs.filter(e => e.prs.length > 0).length;
  console.log(
    `\n   ✓ Found ${foundCount}/${entriesNeedingPRs.length} PR numbers in ${totalTime}s`,
  );
}

/**
 * Generate per-version changelog files in changelogs/ directory
 */
async function generateVersionFiles(
  entries,
  changelogsDir,
  dryRun = false,
  force = false,
) {
  // Group entries by version
  const byVersion = {};
  entries.forEach(entry => {
    const version = entry.version;
    if (!byVersion[version]) {
      byVersion[version] = [];
    }
    byVersion[version].push(entry);
  });

  const versionFiles = [];
  const skippedVersions = [];
  const generatedVersions = [];

  for (const [version, versionEntries] of Object.entries(byVersion)) {
    const fileName = `v${version}.ts`;
    const filePath = path.join(changelogsDir, fileName);
    const varName = `changelog_${version.replace(/\./g, '_')}`;

    // Check if file already exists - skip if it does (unless force flag)
    if (fs.existsSync(filePath) && !force) {
      skippedVersions.push(version);
      // Still add to versionFiles array so main changelog.ts can import it
      versionFiles.push({
        version,
        fileName,
        filePath,
        varName,
        content: null, // No content needed for existing files
        skipped: true,
      });
      continue;
    }

    // Generate TypeScript code for this version
    const entryObjects = versionEntries
      .map(entry => {
        const componentsStr = `[${entry.components
          .map(c => `'${c}'`)
          .join(', ')}]`;
        const prsStr = `[${entry.prs.map(pr => `'${pr}'`).join(', ')}]`;
        const breakingStr = entry.breaking ? `breaking: true,` : '';
        const shaStr = entry.commitSha
          ? `commitSha: '${entry.commitSha}',`
          : '';

        // Escape description for template literal
        const descEscaped = entry.description
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\${/g, '\\${');

        // Escape migration notes if present
        const migrationStr = entry.migration
          ? `migration: \`${entry.migration
              .replace(/\\/g, '\\\\')
              .replace(/`/g, '\\`')
              .replace(/\${/g, '\\${')}\`,\n    `
          : '';

        return `  {
    components: ${componentsStr},
    version: '${entry.version}',
    prs: ${prsStr},
    description: \`${descEscaped}\`,
    ${migrationStr}${breakingStr}
    ${shaStr}
  }`;
      })
      .join(',\n');

    const fileContent = `import type { ChangelogProps } from '../types';

export const ${varName}: ChangelogProps[] = [
${entryObjects}
];
`;

    generatedVersions.push(version);
    versionFiles.push({
      version,
      fileName,
      filePath,
      varName,
      content: fileContent,
      skipped: false,
    });

    if (!dryRun) {
      fs.writeFileSync(filePath, fileContent, 'utf-8');
    }
  }

  // Log summary
  if (skippedVersions.length > 0) {
    console.log(
      `\n⏭️  Skipped ${
        skippedVersions.length
      } existing version files: ${skippedVersions
        .sort((a, b) => compareVersions(a, b))
        .join(', ')}`,
    );
  }
  if (generatedVersions.length > 0) {
    console.log(
      `\n✨ ${dryRun ? 'Would generate' : 'Generated'} ${
        generatedVersions.length
      } new version files: ${generatedVersions
        .sort((a, b) => compareVersions(a, b))
        .join(', ')}`,
    );
  }

  return versionFiles;
}

/**
 * Generate main changelog.ts that imports and spreads all version files
 */
async function generateMainChangelog(
  versionFiles,
  changelogPath,
  dryRun = false,
) {
  // Get the changelogs directory path
  const changelogsDir = path.join(path.dirname(changelogPath), 'changelogs');

  // Read all version files from the changelogs directory
  const allVersionFiles = new Map();

  // First, add all files from the directory (if it exists)
  if (fs.existsSync(changelogsDir)) {
    const files = fs.readdirSync(changelogsDir);
    files.forEach(file => {
      if (file.match(/^v\d+\.\d+\.\d+\.ts$/)) {
        const version = file.replace(/^v/, '').replace(/\.ts$/, '');
        const varName = `changelog_${version.replace(/\./g, '_')}`;
        allVersionFiles.set(version, {
          version,
          fileName: file,
          varName,
        });
      }
    });
  }

  // Then, add/update with files from this run (in case new ones were generated)
  versionFiles.forEach(vf => {
    allVersionFiles.set(vf.version, {
      version: vf.version,
      fileName: vf.fileName,
      varName: vf.varName,
    });
  });

  // Sort versions in descending order
  const sortedVersions = Array.from(allVersionFiles.values()).sort((a, b) =>
    compareVersions(b.version, a.version),
  );

  const imports = sortedVersions
    .map(
      v =>
        `import { ${v.varName} } from './changelogs/${v.fileName.replace(
          '.ts',
          '',
        )}';`,
    )
    .join('\n');

  const spreads = sortedVersions.map(v => `  ...${v.varName},`).join('\n');

  const content = `export * from './types';
${imports}

export const changelog = [
${spreads}
];
`;

  console.log(
    `\n📝 Main changelog.ts will import all ${sortedVersions.length} version files`,
  );

  if (!dryRun) {
    fs.writeFileSync(changelogPath, content, 'utf-8');
  }

  return content;
}

/**
 * Check if an entry already exists in changelog.ts
 */
function isDuplicate(entry, existingContent) {
  // Simple check: look for version + description substring
  const descStart = entry.description.substring(0, 50);
  const pattern = `version: '${entry.version}'`;

  const versionIndex = existingContent.indexOf(pattern);
  if (versionIndex === -1) return false;

  // Check if description appears near this version
  const contextWindow = existingContent.substring(
    Math.max(0, versionIndex - 200),
    versionIndex + 500,
  );

  return contextWindow.includes(descStart);
}

/**
 * Detect GitHub authentication method
 * Priority: gh CLI → GITHUB_TOKEN env → unauthenticated
 */
function getGitHubAuth() {
  // 1. Try gh CLI (preferred - uses keyring auth)
  try {
    // Check specifically for github.com authentication
    const output = execSync('gh auth status -h github.com 2>&1', {
      encoding: 'utf-8',
    });
    if (output.includes('Logged in to github.com')) {
      console.log('✓ Using gh CLI authentication');
      return { method: 'gh-cli' };
    }
  } catch {
    // gh not installed or not authenticated to github.com
  }

  // 2. Try GITHUB_TOKEN env var
  if (process.env.GITHUB_TOKEN) {
    console.log('✓ Using GITHUB_TOKEN authentication');
    return { method: 'token', token: process.env.GITHUB_TOKEN };
  }

  // 3. Fallback to unauthenticated (60 req/hour limit)
  console.warn('⚠️  Using unauthenticated GitHub API (60 requests/hour)');
  console.warn('   For higher limits: authenticate gh CLI or set GITHUB_TOKEN');
  return { method: 'unauthenticated' };
}

// Initialize auth and Octokit
const githubAuth = getGitHubAuth();
const octokit =
  githubAuth.method === 'token'
    ? new Octokit({ auth: githubAuth.token })
    : new Octokit();

// Cache for PR lookups
const prCache = new Map();

/**
 * Expand a truncated SHA to full SHA using local git repository
 * Falls back to GitHub API if git rev-parse fails
 */
async function expandCommitSha(shortSha) {
  try {
    // First try local git repository (fastest, works for all commits)
    // We need to run this from the backstage monorepo root
    const repoRoot = path.join(__dirname, '../../');

    try {
      const fullSha = execSync(`git rev-parse ${shortSha}`, {
        encoding: 'utf-8',
        cwd: repoRoot,
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim();

      if (fullSha && fullSha.length === 40) {
        return fullSha;
      }
    } catch (gitError) {
      // Handle ambiguous SHA - parse git's error output to find commit candidates
      if (gitError.stderr && gitError.stderr.includes('ambiguous')) {
        const stderr = gitError.stderr.toString();
        // Extract commit SHAs from git's hint output
        // Format: "hint:   83c100e6accfb commit 2025-10-22 - message"
        const commitMatch = stderr.match(/hint:\s+([a-f0-9]+)\s+commit\s+/);
        if (commitMatch && commitMatch[1]) {
          // Found the commit SHA from the ambiguous candidates
          const candidateSha = commitMatch[1];
          // Verify this is a valid commit
          try {
            const fullSha = execSync(`git rev-parse ${candidateSha}`, {
              encoding: 'utf-8',
              cwd: repoRoot,
            }).trim();
            if (fullSha && fullSha.length === 40) {
              return fullSha;
            }
          } catch {
            // Candidate didn't work, continue to GitHub API
          }
        }
      }
      // Commit not in local repo, try GitHub API
    }
  } catch (error) {
    // Error setting up git command, try GitHub API
  }

  try {
    // Fallback to GitHub API
    if (githubAuth.method === 'gh-cli') {
      const result = execSync(
        `gh api repos/backstage/backstage/commits/${shortSha} --jq '.sha' 2>/dev/null`,
        { encoding: 'utf-8' },
      ).trim();
      return result || null;
    } else {
      // Use Octokit
      const { data: commit } = await octokit.rest.repos.getCommit({
        owner: 'backstage',
        repo: 'backstage',
        ref: shortSha,
      });
      return commit.sha;
    }
  } catch (error) {
    // Commit not found or other error - return null silently
    return null;
  }
}

/**
 * Find PR number for a commit SHA using GitHub API
 */
async function findPRNumber(commitSha) {
  // Check cache first
  if (prCache.has(commitSha)) {
    return prCache.get(commitSha);
  }

  try {
    // If SHA is truncated (7 chars), expand it first
    let fullSha = commitSha;
    if (commitSha.length === 7) {
      fullSha = await expandCommitSha(commitSha);
      if (!fullSha) {
        // Commit not found
        console.warn(`⚠️  Commit not found: ${commitSha}`);
        prCache.set(commitSha, null);
        return null;
      }
    }

    let prNumber = null;

    // Use gh CLI if available (faster, uses existing auth)
    if (githubAuth.method === 'gh-cli') {
      try {
        const result = execSync(
          `gh api repos/backstage/backstage/commits/${fullSha}/pulls --jq '.[0].number' 2>/dev/null`,
          { encoding: 'utf-8' },
        ).trim();
        prNumber = result || null;
      } catch (ghError) {
        // Handle gh CLI errors gracefully - commit exists but has no PR
        prNumber = null;
      }
    } else {
      // Otherwise use Octokit (token or unauthenticated)
      const { data: prs } =
        await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
          owner: 'backstage',
          repo: 'backstage',
          commit_sha: fullSha,
        });
      prNumber = prs.length > 0 ? prs[0].number.toString() : null;
    }

    // Cache the result
    prCache.set(commitSha, prNumber);
    return prNumber;
  } catch (error) {
    if (error.message?.includes('rate limit')) {
      console.error('⚠️  GitHub API rate limit exceeded');
      console.error(
        '   Authenticate gh CLI or set GITHUB_TOKEN for higher limits',
      );
    } else {
      console.warn(`⚠️  Error finding PR for ${commitSha}: ${error.message}`);
    }
    prCache.set(commitSha, null);
    return null;
  }
}

/**
 * Main sync function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');

  const changelogTsPath = path.join(__dirname, '../src/utils/changelog.ts');
  const changelogMdPath = path.join(
    __dirname,
    '../../packages/ui/CHANGELOG.md',
  );

  // Validate files exist
  if (!fs.existsSync(changelogTsPath)) {
    throw new Error(`changelog.ts not found at: ${changelogTsPath}`);
  }
  if (!fs.existsSync(changelogMdPath)) {
    throw new Error(`CHANGELOG.md not found at: ${changelogMdPath}`);
  }

  console.log('📋 Syncing UI component changelogs...\n');
  if (force) {
    console.log('⚠️  Force mode: Will overwrite existing version files\n');
  }

  // Get last synced version (null if force mode to process all)
  const lastVersion = force ? null : getLastSyncedVersion(changelogTsPath);
  console.log(
    `Last synced version: ${lastVersion || '(none - processing all versions)'}`,
  );

  // Get valid components
  const validComponents = getValidComponents(changelogTsPath);
  console.log(`Valid components: ${validComponents.length}`);

  // Parse CHANGELOG.md
  console.log('\n📖 Parsing CHANGELOG.md...');
  const allEntries = await parseChangelogMd(
    changelogMdPath,
    lastVersion,
    validComponents,
  );
  console.log(
    `Found ${allEntries.length} total entries${
      force ? '' : ` since ${lastVersion}`
    }`,
  );

  // Read existing changelog content for duplicate detection
  const existingContent = fs.readFileSync(changelogTsPath, 'utf-8');

  // Filter to only new, non-duplicate entries
  const relevantEntries = allEntries.filter(
    e => !isDuplicate(e, existingContent),
  );

  const duplicatesCount = allEntries.length - relevantEntries.length;
  if (duplicatesCount > 0) {
    console.log(`Skipped ${duplicatesCount} duplicate entries`);
  }

  console.log(`Relevant entries: ${relevantEntries.length}`);

  if (relevantEntries.length === 0) {
    console.log('\n✅ No new entries to sync');
    return;
  }

  // Fetch PR numbers for new entries (lazy fetch - only for entries that will be written)
  await fetchPRNumbers(relevantEntries, dryRun);

  // Show summary
  console.log('\n📝 New entries by component:');
  const byComponent = {};
  relevantEntries.forEach(entry => {
    if (entry.components.length === 0) {
      byComponent['(general)'] = (byComponent['(general)'] || 0) + 1;
    } else {
      entry.components.forEach(comp => {
        byComponent[comp] = (byComponent[comp] || 0) + 1;
      });
    }
  });
  Object.entries(byComponent).forEach(([comp, count]) => {
    console.log(`  - ${comp}: ${count} ${count === 1 ? 'entry' : 'entries'}`);
  });

  // Warn about unknown components
  const unknownComponents = [];
  allEntries.forEach(entry => {
    const fullText = entry.description;
    const componentMatch = fullText.match(
      /Affected components?:[ \t]*([^\n]+)/i,
    );
    if (componentMatch) {
      const names = componentMatch[1].split(',').map(n => n.trim());
      names.forEach(name => {
        if (!mapComponentName(name, validComponents)) {
          unknownComponents.push(name);
        }
      });
    }
  });

  if (unknownComponents.length > 0) {
    console.log('\n⚠️  Unknown components (skipped):');
    [...new Set(unknownComponents)].forEach(name => {
      console.log(`  - ${name}`);
    });
  }

  // Create changelogs directory if it doesn't exist
  const changelogsDir = path.join(__dirname, '../src/utils/changelogs');
  if (!fs.existsSync(changelogsDir) && !dryRun) {
    fs.mkdirSync(changelogsDir, { recursive: true });
  }

  // Generate version files
  console.log(
    `\n${
      dryRun ? '🔍 Dry run - would generate' : '✍️  Generating'
    } version files...`,
  );

  const versionFiles = await generateVersionFiles(
    relevantEntries,
    changelogsDir,
    dryRun,
    force,
  );

  // Generate main changelog.ts
  const mainContent = await generateMainChangelog(
    versionFiles,
    changelogTsPath,
    dryRun,
  );

  if (!dryRun) {
    console.log('\n✅ Changelog sync complete!');
    const newFiles = versionFiles.filter(vf => !vf.skipped).length;
    const skippedFiles = versionFiles.filter(vf => vf.skipped).length;
    if (newFiles > 0) {
      console.log(
        `   Generated ${newFiles} new version file${newFiles === 1 ? '' : 's'}`,
      );
    }
    if (skippedFiles > 0) {
      console.log(
        `   Preserved ${skippedFiles} existing version file${
          skippedFiles === 1 ? '' : 's'
        }`,
      );
    }
    console.log(`   Updated ${changelogTsPath}`);
  } else {
    console.log('\n📄 Sample version file content:\n');
    // Find first non-skipped version file for sample
    const sampleFile = versionFiles.find(vf => !vf.skipped && vf.content);
    if (sampleFile) {
      const sample = sampleFile.content.split('\n').slice(0, 30).join('\n');
      console.log(sample);
      console.log('...\n');
    } else {
      console.log('(No new version files to generate)\n');
    }

    console.log('\n📄 Main changelog.ts content:\n');
    console.log(mainContent);

    const newFiles = versionFiles.filter(vf => !vf.skipped).length;
    const skippedFiles = versionFiles.filter(vf => vf.skipped).length;

    console.log('\n✅ Dry run complete - no files were modified');
    if (newFiles > 0) {
      console.log(
        `   Run without --dry-run to generate ${newFiles} new version file${
          newFiles === 1 ? '' : 's'
        }`,
      );
    }
    if (skippedFiles > 0) {
      console.log(
        `   ${skippedFiles} existing version file${
          skippedFiles === 1 ? '' : 's'
        } will be preserved`,
      );
    }
  }
}

// Run main if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}
