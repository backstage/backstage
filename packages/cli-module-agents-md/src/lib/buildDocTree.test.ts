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

import { buildSections } from './buildDocTree';

describe('buildSections', () => {
  it('groups files by top-level directory', () => {
    const sections = buildSections([
      'api/deprecations.md',
      'api/utility-apis.md',
      'auth/index.md',
      'auth/identity-resolver.md',
    ]);

    expect(sections).toHaveLength(2);
    expect(sections[0].name).toBe('api');
    expect(sections[0].files).toHaveLength(2);
    expect(sections[0].files[0].relativePath).toBe('api/deprecations.md');
    expect(sections[1].name).toBe('auth');
    expect(sections[1].files).toHaveLength(2);
  });

  it('creates subsections for nested directories', () => {
    const sections = buildSections([
      'backend-system/index.md',
      'backend-system/architecture/01-index.md',
      'backend-system/architecture/02-backends.md',
      'backend-system/building-plugins/01-index.md',
    ]);

    expect(sections).toHaveLength(1);
    const bs = sections[0];
    expect(bs.name).toBe('backend-system');
    expect(bs.files).toHaveLength(1);
    expect(bs.files[0].relativePath).toBe('backend-system/index.md');
    expect(bs.subsections).toHaveLength(2);
    expect(bs.subsections[0].name).toBe('backend-system/architecture');
    expect(bs.subsections[0].files).toHaveLength(2);
    expect(bs.subsections[1].name).toBe('backend-system/building-plugins');
    expect(bs.subsections[1].files).toHaveLength(1);
  });

  it('sorts sections and subsections alphabetically', () => {
    const sections = buildSections([
      'plugins/index.md',
      'auth/index.md',
      'conf/index.md',
    ]);

    expect(sections.map(s => s.name)).toEqual(['auth', 'conf', 'plugins']);
  });

  it('handles top-level root files', () => {
    const sections = buildSections(['publishing.md', 'api/index.md']);

    expect(sections).toHaveLength(2);
    expect(sections[0].name).toBe('.');
    expect(sections[0].files[0].relativePath).toBe('publishing.md');
    expect(sections[1].name).toBe('api');
  });

  it('returns empty array for no files', () => {
    expect(buildSections([])).toEqual([]);
  });

  it('handles deeply nested files', () => {
    const sections = buildSections(['features/search/how-to-guides/guide.md']);

    expect(sections).toHaveLength(1);
    expect(sections[0].name).toBe('features');
    expect(sections[0].files).toHaveLength(0);
    expect(sections[0].subsections).toHaveLength(1);
    expect(sections[0].subsections[0].name).toBe(
      'features/search/how-to-guides',
    );
  });
});
