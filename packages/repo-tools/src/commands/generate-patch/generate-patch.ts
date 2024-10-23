/*
 * Copyright 2024 The Backstage Authors
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

import { getPackages, Package, Packages } from '@manypkg/get-packages';
import os from 'os';
import fs from 'fs-extra';
import {
  relative as relativePath,
  join as joinPath,
  resolve as resolvePath,
  posix,
} from 'path';
import { exec } from '../../lib/exec';
import { ForwardedError } from '@backstage/errors';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { ReadableStream } from 'stream/web';
import tar from 'tar';

// TODO: add option for this
const DEFAULT_REGISTRY_URL = 'https://registry.npmjs.org';

const PATCH_GITIGNORE = [
  // Avoid generating patches for source maps
  '*.map',
  // Patching package.json has no effect, so exclude
  'package.json',
  // No point patching docs
  '/*.md',
  '/docs',
];

interface PatchContext {
  sourceRepo: Packages;
  targetRepo: Packages;
  sourcePkg: Package;
  packageName: string;
  targetRoot: string;
  workDir: string;
  registryUrl: string;
}

export default async (
  packageArg: string,
  opts: {
    target: string;
    query?: string;
    registryUrl?: string;
    baseVersion?: string;
  },
) => {
  const sourceRepo = await getPackages(process.cwd());
  const targetRepo = await getPackages(opts.target);
  const registryUrl = opts.registryUrl || DEFAULT_REGISTRY_URL;

  if (targetRepo.tool !== 'yarn') {
    throw new Error(
      `Unable to generate patch for target repo, tool is not supported: ${targetRepo.tool}`,
    );
  }
  if (sourceRepo.root.dir === targetRepo.root.dir) {
    throw new Error(
      `Unexpected workspace roots, source and target repo are the same: ${sourceRepo.root.dir}`,
    );
  }

  const sourcePkg = sourceRepo.packages.find(
    pkg =>
      pkg.packageJson.name === packageArg ||
      relativePath(sourceRepo.root.dir, pkg.dir) === packageArg,
  );
  if (!sourcePkg) {
    throw new Error(`Could not find package ${packageArg} in source repo`);
  }

  const tmpDir = await fs.mkdtemp(os.tmpdir());
  const ctx: PatchContext = {
    sourceRepo,
    targetRepo,
    sourcePkg,
    packageName: sourcePkg.packageJson.name,
    targetRoot: targetRepo.root.dir,
    registryUrl,
    workDir: tmpDir,
  };

  // Create a new temporary directory where we put archives and generate patches
  try {
    const updateTargetRootPkg = await loadTrimmedRootPkg(ctx, opts.query);

    console.log(
      `Building and packaging target package ${sourcePkg.packageJson.name}`,
    );
    const targetArchive = await buildTargetArchive(ctx);

    console.log(`Generating patch from ${sourcePkg.packageJson.version}`);
    const patchEntry = await generatePatch(
      ctx,
      targetArchive,
      opts.baseVersion || sourcePkg.packageJson.version,
    );

    await updateTargetRootPkg(patchEntry);

    console.log(
      'Done, be sure to reinstall dependencies in the target workspace',
    );
  } finally {
    fs.rmSync(tmpDir, { force: true, recursive: true, maxRetries: 3 });
  }
};

// Load the root package.json from the target repo, and trim out any existing
// resolution entries and patches. The changes can be saved along with the new
// patch entry by calling the returned function.
async function loadTrimmedRootPkg(ctx: PatchContext, query?: string) {
  const newPkgJson = JSON.parse(
    JSON.stringify(ctx.targetRepo.root.packageJson),
  );
  const resolutionsObj =
    newPkgJson.resolutions || (newPkgJson.resolutions = {});

  const searchEntry = query ? `${ctx.packageName}@${query}` : ctx.packageName;

  // Check if there is a resolution for all versions of the source package, in
  // that case we just replace that, rather than patching each version
  if (query || resolutionsObj[searchEntry]) {
    const existingPatchFile = tryParsePatchResolution(
      resolutionsObj[searchEntry],
    );

    if (existingPatchFile) {
      await fs.rm(resolvePath(ctx.targetRoot, existingPatchFile), {
        force: true,
      });
    }

    return async (patchEntry?: string) => {
      resolutionsObj[searchEntry] = patchEntry;

      await fs.writeJson(
        resolvePath(ctx.targetRoot, 'package.json'),
        newPkgJson,
        {
          spaces: 2,
        },
      );
    };
  }

  const resolutionMap = await readResolutionMap(ctx);

  // Any existing resolution entries for the package are removed
  const entriesToRemove = Object.entries(resolutionsObj).filter(([key]) =>
    key.startsWith(`${ctx.packageName}@`),
  ) as Array<[string, string]>;

  for (const [key, value] of entriesToRemove) {
    delete resolutionsObj[key];

    // Existing patch files are also removed
    const existingPatchFile = tryParsePatchResolution(value);
    if (existingPatchFile) {
      await fs.rm(resolvePath(ctx.targetRoot, existingPatchFile), {
        force: true,
      });
    }
  }

  // This collects the list of version descriptors that we want to apply the patch to
  const descriptors = new Array<string>();
  for (const [descriptor, locator] of resolutionMap) {
    // Skip virtual and other non-npm entries
    if (!locator.includes('@npm:')) {
      // We know that virtual entries are fine to skip, but want to warn if we skip others
      if (!locator.includes('@virtual:')) {
        console.warn(`Skipping resolution for ${descriptor}, no version found`);
      }
      continue;
    }

    descriptors.push(descriptor);
  }

  return async (patchEntry?: string) => {
    for (const descriptor of descriptors) {
      resolutionsObj[descriptor] = patchEntry;
    }
    // We use the same patch for all versions of the package, if they don't
    // apply it might require manual intervention using the --query option
    await fs.writeJson(
      resolvePath(ctx.targetRoot, 'package.json'),
      newPkgJson,
      {
        spaces: 2,
      },
    );
  };
}

// Generate a new patch and return the path to the generated patch file. Will
// instead return undefined if the patch is empty.
async function generatePatch(
  ctx: PatchContext,
  targetArchive: string,
  version: string,
): Promise<string | undefined> {
  const baseArchive = await downloadArchive(ctx, version);
  const patch = await generatePatchForArchives(ctx, baseArchive, targetArchive);
  if (!patch) {
    console.warn(`Generated patch for ${ctx.packageName} is empty`);
    return undefined;
  }
  const cleanPackageName = ctx.packageName.replace('/', '-');
  const describeResult = await exec(
    'git',
    ['describe', '--always', '--dirty', "--exclude='*'"],
    {
      cwd: ctx.sourceRepo.root.dir,
    },
  );
  const describe = describeResult.stdout.toString('utf8').trim();
  const name = `${cleanPackageName}-${version}-${describe}.patch`;
  const patchDir = joinPath(ctx.targetRepo.root.dir, '.yarn', 'patches');

  await fs.ensureDir(patchDir);
  await fs.writeFile(joinPath(patchDir, name), patch, 'utf8');

  const locator = `${ctx.sourcePkg.packageJson.name}@npm:${version}`;
  return `patch:${encodeURIComponent(locator)}#${posix.join(
    '.',
    '.yarn',
    'patches',
    name,
  )}`;
}

// Check if an existing resolution entry is a patch, and in that case return the
// path to the patch file.
function tryParsePatchResolution(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }
  if (!value.startsWith('patch:')) {
    return undefined;
  }
  const patchFilePath = value.split('#')[1];
  return patchFilePath;
}

// Read out the descriptors for all entries of the package in the target repo
async function readResolutionMap(
  ctx: PatchContext,
): Promise<Map<string, string>> {
  const { stdout: whyOutput } = await exec(
    'yarn',
    ['why', '--json', ctx.packageName],
    {
      cwd: ctx.targetRoot,
      maxBuffer: 1024 * 1024 * 1024,
    },
  );

  const resolutionMap = new Map<string, string>();

  for (const line of whyOutput.toString('utf8').trim().split(/\r?\n/)) {
    for (const { locator, descriptor } of Object.values(
      JSON.parse(line).children,
    ) as Array<{ locator: string; descriptor: string }>) {
      const existing = resolutionMap.get(descriptor);
      if (existing) {
        if (existing !== locator) {
          throw new Error(
            `Conflicting resolutions in target package for ${descriptor}: ${existing} vs ${locator}`,
          );
        }
      } else {
        resolutionMap.set(descriptor, locator);
      }
    }
  }

  return resolutionMap;
}

// Build and pack the source package to an archive in the work directory
async function buildTargetArchive(ctx: PatchContext): Promise<string> {
  await exec('yarn', ['build'], {
    cwd: ctx.sourcePkg.dir,
  });

  const archiveName = 'target.tgz';

  await exec('yarn', ['pack', '--out', joinPath(ctx.workDir, archiveName)], {
    cwd: ctx.sourcePkg.dir,
  });

  return archiveName;
}

// Downloads a tar archive for the source package at the specified version
async function downloadArchive(
  ctx: PatchContext,
  version: string,
): Promise<string> {
  const nameWithoutScope = ctx.packageName.replace(/^@.+\//, '');
  const tarName = `${nameWithoutScope}-${version}.tgz`;

  if (await fs.pathExists(joinPath(ctx.workDir, tarName))) {
    return tarName;
  }

  try {
    const res = await fetch(
      `${ctx.registryUrl}/${ctx.packageName}/-/${tarName}`,
    );
    if (!res.ok) {
      throw new Error(
        `Request failed with status ${res.status} ${res.statusText}`,
      );
    }
    if (!res.body) {
      throw new Error('Missing response body');
    }
    const write = fs.createWriteStream(joinPath(ctx.workDir, tarName));

    await finished(Readable.fromWeb(res.body as ReadableStream).pipe(write));

    return tarName;
  } catch (error) {
    throw new ForwardedError(
      `Failed to fetch tarball for ${ctx.packageName}@${version}`,
      error,
    );
  }
}

// Given two archives, generate a git diff patch for the differences between
async function generatePatchForArchives(
  ctx: PatchContext,
  baseArchive: string,
  headArchive: string,
): Promise<string> {
  const basePath = joinPath(ctx.workDir, baseArchive);
  const headPath = joinPath(ctx.workDir, headArchive);

  const patchDir = await fs.mkdtemp(joinPath(ctx.workDir, 'patch-'));

  // Extract base archive contents to use as base for patch
  // Strip 1 level as the root of the archive is a package/ directory
  await tar.extract({ file: basePath, cwd: patchDir, strip: 1 });

  // Write .gitignore to avoid generating patches for certain files
  await fs.writeFile(
    joinPath(patchDir, '.gitignore'),
    PATCH_GITIGNORE.join(os.EOL),
  );

  // Init git an populate index
  await exec('git', ['init'], { cwd: patchDir });
  await exec('git', ['add', '.'], { cwd: patchDir });

  // Remove all existing files
  for (const path of await fs.readdir(patchDir)) {
    if (path !== '.git' && path !== '.gitignore') {
      await fs.rm(joinPath(patchDir, path), {
        recursive: true,
        maxRetries: 3,
        force: true,
      });
    }
  }

  // Extract the target archive to use a target for the patch
  await tar.extract({ file: headPath, cwd: patchDir, strip: 1 });

  const { stdout: patch } = await exec('git', ['diff'], { cwd: patchDir });
  return patch.toString('utf8');
}
