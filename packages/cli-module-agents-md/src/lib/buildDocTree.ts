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

import fs from 'node:fs';
import { DocSection, DocFile } from './types';

/** Directories to exclude from the index */
const EXCLUDED_DIRS = [
  'releases',
  'architecture-decisions',
  'assets',
  'landing-page',
];

/**
 * Scan a docs directory and build a hierarchical tree of documentation sections.
 */
export async function buildDocTree(docsPath: string): Promise<DocSection[]> {
  const allFiles = fs.readdirSync(docsPath, {
    recursive: true,
    encoding: 'utf-8',
  });

  const mdFiles = allFiles
    .map(f => f.replace(/\\/g, '/'))
    .filter(f => f.endsWith('.md'))
    .filter(f => {
      const topDir = f.split('/')[0];
      return !EXCLUDED_DIRS.includes(topDir);
    })
    .sort();

  return buildSections(mdFiles);
}

/**
 * Pure function: given a sorted list of relative paths, group them into sections.
 */
export function buildSections(relativePaths: string[]): DocSection[] {
  const sectionMap = new Map<
    string,
    { files: DocFile[]; subsections: Map<string, DocFile[]> }
  >();

  for (const filePath of relativePaths) {
    const parts = filePath.split('/');

    if (parts.length === 1) {
      // Top-level file
      if (!sectionMap.has('.')) {
        sectionMap.set('.', { files: [], subsections: new Map() });
      }
      sectionMap.get('.')!.files.push({ relativePath: filePath });
    } else {
      const topDir = parts[0];
      if (!sectionMap.has(topDir)) {
        sectionMap.set(topDir, { files: [], subsections: new Map() });
      }
      const section = sectionMap.get(topDir)!;

      if (parts.length === 2) {
        section.files.push({ relativePath: filePath });
      } else {
        // Nested: group by full subdirectory path
        const subDir = parts.slice(0, parts.length - 1).join('/');
        if (!section.subsections.has(subDir)) {
          section.subsections.set(subDir, []);
        }
        section.subsections.get(subDir)!.push({ relativePath: filePath });
      }
    }
  }

  const sections: DocSection[] = [];

  for (const [name, data] of sectionMap) {
    if (name === '.') continue;

    const subsections: DocSection[] = [];
    for (const [subPath, subFiles] of data.subsections) {
      subsections.push({
        name: subPath,
        files: subFiles,
        subsections: [],
      });
    }
    subsections.sort((a, b) => a.name.localeCompare(b.name));

    sections.push({
      name,
      files: data.files,
      subsections,
    });
  }

  sections.sort((a, b) => a.name.localeCompare(b.name));

  // Prepend root-level files if any
  const rootData = sectionMap.get('.');
  if (rootData && rootData.files.length > 0) {
    sections.unshift({
      name: '.',
      files: rootData.files,
      subsections: [],
    });
  }

  return sections;
}
