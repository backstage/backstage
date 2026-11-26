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

import { resolvePackagePath } from '@backstage/backend-plugin-api';
import { targetPaths } from '@backstage/cli-common';
import { createHash } from 'node:crypto';
import fs from 'fs-extra';
import {
  join,
  relative as relativePath,
  resolve as resolvePath,
  sep,
} from 'node:path';
import { loadYaml } from '../yaml';
import { OPENAPI_MANIFEST_FILE, OUTPUT_PATH } from './constants';

/**
 * Describes the generated files in an OpenAPI output directory, so that
 * `repo schema openapi validate` can detect stale or hand-edited output.
 */
export type OpenApiManifest = {
  version: 1;
  kind: 'server' | 'client';
  spec: {
    /** POSIX path to the spec, relative to the generated directory. */
    path: string;
    /** Hash of the canonical JSON form of the parsed spec. */
    sha256: string;
  };
  generator: {
    openapiGenerator: string;
    templateSha256: string;
  };
  additionalProperties: string | null;
  /** Aggregate hash of all generated files, excluding the manifest. */
  filesSha256: string;
};

function sha256(content: string | Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

function toPosix(path: string): string {
  return path.split(sep).join('/');
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => (a < b ? -1 : 1))
        .map(([k, v]) => [k, sortKeys(v)]),
    );
  }
  return value;
}

function hashNormalized(content: Buffer): string {
  return sha256(content.toString('utf8').replace(/\r\n/g, '\n'));
}

async function listFiles(dir: string, base = dir): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        return listFiles(full, base);
      }
      return [toPosix(relativePath(base, full))];
    }),
  );
  return files.flat().sort();
}

/** Hash of the canonical JSON form of the parsed spec file. */
export async function computeSpecHash(specPath: string): Promise<string> {
  const yaml = loadYaml(await fs.readFile(specPath, 'utf8'));
  return sha256(JSON.stringify(sortKeys(yaml)));
}

/**
 * Hash of every file in the generated directory, excluding the manifest. Each
 * file contributes its POSIX relative path and its CRLF-normalized content hash.
 */
export async function computeFilesHash(generatedDir: string): Promise<string> {
  const files = (await listFiles(generatedDir)).filter(
    file => file !== OPENAPI_MANIFEST_FILE,
  );
  const hash = createHash('sha256');
  for (const file of files) {
    const content = await fs.readFile(join(generatedDir, file));
    hash.update(`${file}\0${hashNormalized(content)}\n`);
  }
  return hash.digest('hex');
}

async function computeTemplateHash(kind: 'server' | 'client'): Promise<string> {
  const templatesDir = resolvePackagePath('@backstage/repo-tools', 'templates');
  const files = (await listFiles(templatesDir)).filter(
    file =>
      file.startsWith(`typescript-backstage-${kind}/`) ||
      file === `typescript-backstage-${kind}.yaml`,
  );
  const hash = createHash('sha256');
  for (const file of files) {
    const content = await fs.readFile(join(templatesDir, file));
    hash.update(`${file}\0${hashNormalized(content)}\n`);
  }
  return hash.digest('hex');
}

async function readGeneratorVersion(): Promise<string> {
  const config = await fs.readJson(
    resolvePackagePath('@backstage/repo-tools', 'openapitools.json'),
  );
  return config['generator-cli'].version;
}

export async function createManifest(options: {
  kind: 'server' | 'client';
  generatedDir: string;
  specPath: string;
  additionalProperties?: string;
}): Promise<OpenApiManifest> {
  const { kind, generatedDir, specPath } = options;
  return {
    version: 1,
    kind,
    spec: {
      path: toPosix(relativePath(generatedDir, specPath)),
      sha256: await computeSpecHash(specPath),
    },
    generator: {
      openapiGenerator: await readGeneratorVersion(),
      templateSha256: await computeTemplateHash(kind),
    },
    additionalProperties: options.additionalProperties || null,
    filesSha256: await computeFilesHash(generatedDir),
  };
}

/** Writes the manifest. This must be the last step of generation. */
export async function writeManifest(options: {
  kind: 'server' | 'client';
  generatedDir: string;
  specPath: string;
  additionalProperties?: string;
}): Promise<void> {
  const manifest = await createManifest(options);
  await fs.writeFile(
    join(options.generatedDir, OPENAPI_MANIFEST_FILE),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}

/**
 * Checks the generated directory of a package against its manifest. Returns
 * `null` if the package has no generated directory.
 */
export async function verifyManifest(
  packageDir: string,
): Promise<{ errors: string[]; warnings: string[] } | null> {
  const generatedDir = resolvePath(packageDir, OUTPUT_PATH);
  const manifestPath = join(generatedDir, OPENAPI_MANIFEST_FILE);
  if (!(await fs.pathExists(generatedDir))) {
    return null;
  }
  const errors: string[] = [];
  const warnings: string[] = [];
  const packageRelative = toPosix(
    relativePath(targetPaths.rootDir, packageDir),
  );

  if (!(await fs.pathExists(manifestPath))) {
    warnings.push(
      `\`${OUTPUT_PATH}\` has no \`${OPENAPI_MANIFEST_FILE}\`. Regenerate it to enable drift checks.`,
    );
    return { errors, warnings };
  }

  const manifest: OpenApiManifest = await fs.readJson(manifestPath);
  const specPath = resolvePath(generatedDir, manifest.spec.path);
  const specPackageDir = resolvePath(specPath, '..', '..', '..');
  const specPackage = toPosix(
    relativePath(targetPaths.rootDir, specPackageDir),
  );
  const fix =
    manifest.kind === 'server'
      ? `Fix: run \`yarn backstage-repo-tools package schema openapi generate --server\` from '${specPackage}'.`
      : `Fix: run \`yarn backstage-repo-tools package schema openapi generate --client-package ${packageRelative}\` from '${specPackage}'.`;

  const problems: string[] = [];
  if (!(await fs.pathExists(specPath))) {
    problems.push(`Spec file \`${manifest.spec.path}\` is missing.`);
  } else if ((await computeSpecHash(specPath)) !== manifest.spec.sha256) {
    problems.push(
      `Spec \`${manifest.spec.path}\` has changed since the files were generated.`,
    );
  }
  if ((await computeFilesHash(generatedDir)) !== manifest.filesSha256) {
    problems.push(
      `Generated files in \`${OUTPUT_PATH}\` changed: a file was edited, added or removed.`,
    );
  }
  if (problems.length > 0) {
    errors.push(`${problems.join('\n')}\n${fix}`);
  }

  if (
    manifest.generator.openapiGenerator !== (await readGeneratorVersion()) ||
    manifest.generator.templateSha256 !==
      (await computeTemplateHash(manifest.kind))
  ) {
    warnings.push(
      `\`${OUTPUT_PATH}\` was generated with a different generator version or templates. ${fix.replace(
        'Fix: run',
        'Consider running',
      )}`,
    );
  }

  return { errors, warnings };
}
