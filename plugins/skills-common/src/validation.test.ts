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

import { validateSkillName, parseSkillFrontmatter } from './validation';

describe('validateSkillName', () => {
  it('accepts valid names', () => {
    expect(() => validateSkillName('a')).not.toThrow();
    expect(() => validateSkillName('pdf-processing')).not.toThrow();
    expect(() => validateSkillName('data-analysis')).not.toThrow();
    expect(() => validateSkillName('code-review')).not.toThrow();
    expect(() => validateSkillName('a1')).not.toThrow();
  });

  it('rejects empty names', () => {
    expect(() => validateSkillName('')).toThrow('Skill name is required');
  });

  it('rejects names longer than 64 characters', () => {
    expect(() => validateSkillName('a'.repeat(65))).toThrow(
      'at most 64 characters',
    );
  });

  it('rejects names starting with a hyphen', () => {
    expect(() => validateSkillName('-pdf')).toThrow(
      'must not start or end with a hyphen',
    );
  });

  it('rejects names ending with a hyphen', () => {
    expect(() => validateSkillName('pdf-')).toThrow(
      'must not start or end with a hyphen',
    );
  });

  it('rejects names with consecutive hyphens', () => {
    expect(() => validateSkillName('pdf--processing')).toThrow(
      'must not contain consecutive hyphens',
    );
  });

  it('rejects uppercase names', () => {
    expect(() => validateSkillName('PDF-Processing')).toThrow(
      'lowercase alphanumeric',
    );
  });
});

describe('parseSkillFrontmatter', () => {
  it('parses valid frontmatter', () => {
    const content = [
      '---',
      'name: my-skill',
      'description: A test skill for testing.',
      '---',
      '',
      '# My Skill',
      'Instructions here.',
    ].join('\n');

    const result = parseSkillFrontmatter(content);
    expect(result).toEqual({
      name: 'my-skill',
      description: 'A test skill for testing.',
      license: undefined,
      compatibility: undefined,
      metadata: undefined,
      allowedTools: undefined,
    });
  });

  it('parses frontmatter with all optional fields', () => {
    const content = [
      '---',
      'name: pdf-processing',
      'description: Extract text and tables from PDF files.',
      'license: Apache-2.0',
      'compatibility: Requires python3',
      'allowed-tools: Bash(git:*) Read',
      'metadata:',
      '  author: example-org',
      '  version: "1.0"',
      '---',
      '',
      'Body content.',
    ].join('\n');

    const result = parseSkillFrontmatter(content);
    expect(result).toEqual({
      name: 'pdf-processing',
      description: 'Extract text and tables from PDF files.',
      license: 'Apache-2.0',
      compatibility: 'Requires python3',
      metadata: { author: 'example-org', version: '1.0' },
      allowedTools: 'Bash(git:*) Read',
    });
  });

  it('throws when allowed-tools is not a string', () => {
    const content = [
      '---',
      'name: pdf-processing',
      'description: Extract text and tables from PDF files.',
      'allowed-tools:',
      '  - read_file',
      '  - grep_search',
      '---',
      '',
      'Body content.',
    ].join('\n');

    expect(() => parseSkillFrontmatter(content)).toThrow(
      "field 'allowedTools' must be a string",
    );
  });

  it('throws when compatibility is not a string', () => {
    const content = [
      '---',
      'name: pdf-processing',
      'description: Extract text and tables from PDF files.',
      'compatibility:',
      '  mode: copilot',
      '---',
      '',
      'Body content.',
    ].join('\n');

    expect(() => parseSkillFrontmatter(content)).toThrow(
      "field 'compatibility' must be a string",
    );
  });

  it('throws when metadata is not a map', () => {
    const content = [
      '---',
      'name: pdf-processing',
      'description: Extract text and tables from PDF files.',
      'metadata: example-org',
      '---',
      '',
      'Body content.',
    ].join('\n');

    expect(() => parseSkillFrontmatter(content)).toThrow(
      "field 'metadata' must be a map of string values",
    );
  });

  it('throws when frontmatter is missing', () => {
    expect(() => parseSkillFrontmatter('# No frontmatter')).toThrow(
      'must contain YAML frontmatter',
    );
  });

  it('throws when name is missing', () => {
    const content = '---\ndescription: Test\n---\n';
    expect(() => parseSkillFrontmatter(content)).toThrow(
      'must contain a name field',
    );
  });

  it('throws when description is missing', () => {
    const content = '---\nname: test\n---\n';
    expect(() => parseSkillFrontmatter(content)).toThrow(
      'must contain a description field',
    );
  });

  it('throws when description exceeds 1024 characters', () => {
    const content = `---\nname: test\ndescription: ${'a'.repeat(1025)}\n---\n`;
    expect(() => parseSkillFrontmatter(content)).toThrow(
      'at most 1024 characters',
    );
  });

  it('validates the skill name from frontmatter', () => {
    const content = '---\nname: INVALID\ndescription: Test skill.\n---\n';
    expect(() => parseSkillFrontmatter(content)).toThrow(
      'lowercase alphanumeric',
    );
  });
});
