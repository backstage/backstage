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
// Kept free of Node imports so it can also be used by the microsite build.

export const manifestFilenamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.yaml$/;

// Manifests that predate the kebab-case rule. Their filenames are also their
// published slugs, so renaming them would break existing links.
export const legacyManifestFilenames: Record<string, true> = {
  'digital.ai-deploy.yaml': true,
  'digital.ai-release.yaml': true,
  'sds_workspace.yaml': true,
};

export function isValidManifestFilename(filename: string): boolean {
  return (
    manifestFilenamePattern.test(filename) ||
    legacyManifestFilenames[filename] === true
  );
}

/** The URL slug of a manifest, which is its filename without `.yaml`. */
export function manifestSlug(filename: string): string {
  return filename.replace(/\.yaml$/, '');
}
