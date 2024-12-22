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

// More predictable git behavior, see https://github.com/yarnpkg/berry/blob/f59bbf9f3828865c14b06a3e5cc3ae284a0db78d/packages/plugin-patch/sources/patchUtils.ts#L291
const GIT_ENV = {
  GIT_CONFIG_NOSYSTEM: '1',
  HOME: '',
  XDG_CONFIG_HOME: '',
  USERPROFILE: '',
};

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
    skipInstall?: boolean;
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

  await verifyYarnVersion(sourceRepo.root.dir);
  await verifyYarnVersion(targetRepo.root.dir);

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

    if (!opts.skipInstall) {
      console.log("Running 'yarn install' in target workspace");
      await exec('yarn', ['install'], {
        cwd: ctx.targetRoot,
      }).catch(() => {
        throw new Error(
          "Failed to run 'yarn install' in target workspace, please run it manually to troubleshoot",
        );
      });
    } else {
      console.log("Skipped running 'yarn install'");
    }
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

  return async (patchEntry?: string) => {
    resolutionsObj[ctx.packageName] = patchEntry;

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

// Verify that a repo is using a supported Yarn version
async function verifyYarnVersion(cwd: string) {
  const exists = await fs.pathExists(joinPath(cwd, '.yarnrc.yml'));
  if (!exists) {
    throw new Error(
      `Missing .yarnrc.yml in ${cwd}, Yarn v1 (classic) is not support by this command`,
    );
  }
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
      env: { ...process.env, ...GIT_ENV },
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
    const url = `${ctx.registryUrl}/${ctx.packageName}/-/${tarName}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Request to ${url} failed with status ${res.status} ${res.statusText}`,
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

  // Init git and populate index
  await exec('git', ['init'], {
    cwd: patchDir,
    env: { ...process.env, ...GIT_ENV },
  });
  await exec('git', ['add', '.'], {
    cwd: patchDir,
    env: { ...process.env, ...GIT_ENV },
  });
  // Commit the base archive contents, so that we can later add all files and diff against the index
  await exec(
    'git',
    [
      '-c',
      'user.name="patcher"',
      '-c',
      'user.email="patcher@acme.org"',
      'commit',
      '-m',
      'base',
    ],
    {
      cwd: patchDir,
      env: { ...process.env, ...GIT_ENV },
    },
  );

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

  // Add and diff against index, to make sure we include untracked files
  await exec('git', ['add', '.'], {
    cwd: patchDir,
    env: { ...process.env, ...GIT_ENV },
  });
  const { stdout: patch } = await exec(
    'git',
    [
      '-c',
      'core.safecrlf=false',
      'diff',
      '--cached',
      '--src-prefix=a/',
      '--dst-prefix=b/',
      '--ignore-cr-at-eol',
      '--full-index',
      '--no-renames',
      '--text',
    ],
    {
      cwd: patchDir,
      env: { ...process.env, ...GIT_ENV },
    },
  );
  return patch.toString('utf8');
}
