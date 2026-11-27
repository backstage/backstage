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

import fs from 'fs-extra';
import path from 'node:path';
import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import { createSourceExcludeMatcher, preserveTechDocsSources } from './sources';

describe('preserveTechDocsSources', () => {
  const inputDir = createMockDirectory();
  const outputDir = createMockDirectory();
  const logger = mockServices.logger.mock();

  beforeEach(() => {
    jest.clearAllMocks();
    outputDir.setContent({
      'index.html': '<html />',
      'techdocs_metadata.json': JSON.stringify({
        engine: 'zensical',
        files: ['index.html'],
      }),
    });
  });

  function readManifest() {
    return fs.readJsonSync(outputDir.resolve('_sources/manifest.json'));
  }

  it('stores the docs the site publishes, and leaves out what it excludes', async () => {
    inputDir.setContent({
      'mkdocs.yml': [
        'site_name: Test',
        'exclude_docs: |',
        '  secret/',
        '  *.draft.md',
        '  !keep.draft.md',
        'draft_docs: |',
        '  drafts/',
      ].join('\n'),
      'README.md': '# Readme',
      'CONTRIBUTING.md': '# Contributing',
      'manifest.json': '{}',
      '.env': 'TOKEN=1',
      docs: {
        'index.md': '# Index',
        'image.png': 'png',
        'guide.draft.md': 'tmp',
        'keep.draft.md': 'tmp',
        '.env': 'TOKEN=1',
        '.hidden': { 'page.md': 'hidden' },
        templates: { 'base.html': 'template' },
        secret: { 'page.md': 'secret' },
        drafts: { 'wip.md': 'draft' },
        node_modules: { 'pkg.js': 'js' },
        build: { 'out.md': 'build' },
        nested: { 'page.md': '# Nested', 'cache.pyc': 'pyc' },
      },
    });
    fs.symlinkSync(
      inputDir.resolve('README.md'),
      inputDir.resolve('docs/link.md'),
    );

    await preserveTechDocsSources({
      inputDir: inputDir.path,
      outputDir: outputDir.path,
      logger,
      excludes: ['*.png', 'build'],
      additionalFiles: [
        'README.md',
        'CONTRIBUTING.md',
        'docs/index.md',
        'docs',
        'manifest.json',
        '.env',
        '../outside.md',
        'missing.md',
      ],
      etag: 'abc123',
    });

    const expectedFiles = [
      'CONTRIBUTING.md',
      'README.md',
      'docs/index.md',
      'docs/keep.draft.md',
      'docs/nested/page.md',
    ];
    expect(readManifest()).toEqual({
      generatedAt: expect.any(Number),
      engine: 'zensical',
      docsDir: 'docs',
      etag: 'abc123',
      files: expectedFiles,
    });
    expect(outputDir.content({ path: '_sources' })).toEqual({
      'CONTRIBUTING.md': '# Contributing',
      'README.md': '# Readme',
      'manifest.json': expect.any(String),
      docs: {
        'index.md': '# Index',
        'keep.draft.md': 'tmp',
        nested: { 'page.md': '# Nested' },
      },
    });
    expect(
      fs.readJsonSync(outputDir.resolve('techdocs_metadata.json')).files,
    ).toEqual([
      'index.html',
      ...[...expectedFiles, 'manifest.json'].map(f =>
        path.join('_sources', ...f.split('/')),
      ),
    ]);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("'docs': only regular files are supported"),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("'manifest.json': the name is reserved"),
    );
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("'../outside.md': path resolves outside"),
    );
  });

  it('uses a custom docs_dir, keeps nested additional file paths, and defaults to README.md', async () => {
    inputDir.setContent({
      'mkdocs.yml': 'site_name: Test\ndocs_dir: content\n',
      'README.md': '# Readme',
      content: { 'index.md': '# Index', 'README.md': '# Content readme' },
    });

    await preserveTechDocsSources({
      inputDir: inputDir.path,
      outputDir: outputDir.path,
      logger,
      engine: 'mkdocs',
    });
    expect(readManifest()).toEqual(
      expect.objectContaining({
        engine: 'mkdocs',
        docsDir: 'content',
        files: ['README.md', 'content/README.md', 'content/index.md'],
      }),
    );

    // README.md can be suppressed through the excludes
    await fs.remove(outputDir.resolve('_sources'));
    await preserveTechDocsSources({
      inputDir: inputDir.path,
      outputDir: outputDir.path,
      logger,
      excludes: ['/README.md'],
    });
    expect(readManifest().files).toEqual([
      'content/README.md',
      'content/index.md',
    ]);
  });

  it('skips storage when docs_dir is the input directory', async () => {
    inputDir.setContent({
      'mkdocs.yml': 'site_name: Test\ndocs_dir: .\n',
      'index.md': '# Index',
    });

    await preserveTechDocsSources({
      inputDir: inputDir.path,
      outputDir: outputDir.path,
      logger,
    });

    expect(fs.existsSync(outputDir.resolve('_sources'))).toBe(false);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('docs_dir resolves to the input directory'),
    );
  });
});

describe('createSourceExcludeMatcher', () => {
  it('matches built-in and configured patterns at any depth, including parents', () => {
    const isExcluded = createSourceExcludeMatcher([
      '*.png',
      'build',
      'docs/private/**',
      '/README.md',
    ]);

    expect(isExcluded('docs/index.md')).toBe(false);
    expect(isExcluded('docs/a/b/c.md')).toBe(false);
    expect(isExcluded('.git/config')).toBe(true);
    expect(isExcluded('docs/.env')).toBe(true);
    expect(isExcluded('docs/node_modules/x.js')).toBe(true);
    expect(isExcluded('docs/x/__pycache__')).toBe(true);
    expect(isExcluded('docs/a.pyc')).toBe(true);
    expect(isExcluded('docs/img/a.png')).toBe(true);
    expect(isExcluded('docs/build/out.md')).toBe(true);
    expect(isExcluded('docs/private/notes.md')).toBe(true);
    expect(isExcluded('docs/public/notes.md')).toBe(false);
    expect(isExcluded('README.md')).toBe(true);
    expect(isExcluded('docs/README.md')).toBe(false);
  });
});
