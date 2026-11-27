/*
 * Copyright 2021 The Backstage Authors
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

import { UrlReaderService } from '@backstage/backend-plugin-api';
import {
  isChildPath,
  resolveSafeChildPath,
} from '@backstage/backend-plugin-api';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import fs from 'fs-extra';
import path from 'node:path';

/**
 * A helper function that reads the contents of a directory from the given URL.
 * Can be used in your own actions, and also used behind fetch:template and fetch:plain
 *
 * @public
 */
export async function fetchContents(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
  baseUrl?: string;
  fetchUrl?: string;
  outputPath: string;
  token?: string;
}) {
  const {
    reader,
    integrations,
    baseUrl,
    fetchUrl = '.',
    outputPath,
    token,
  } = options;

  const fetchUrlIsAbsolute = isFetchUrlAbsolute(fetchUrl);

  // We handle both file locations and url ones
  if (!fetchUrlIsAbsolute && baseUrl?.startsWith('file://')) {
    const basePath = baseUrl.slice('file://'.length);
    const srcDir = resolveSafeChildPath(path.dirname(basePath), fetchUrl);
    await fs.copy(srcDir, outputPath, {
      filter: src => isChildPath(srcDir, src),
    });
  } else {
    const readUrl = getReadUrl(fetchUrl, baseUrl, integrations);

    const res = await reader.readTree(readUrl, { token });
    await fs.ensureDir(outputPath);

    // The tree is extracted into a staging directory first, so that the
    // check below covers only the fetched content and the target directory
    // is only written to once that check has passed. The staging directory
    // is created next to the target, so the copy stays on the same volume
    // as the workspace rather than the system temp folder
    const stagingDir = await fs.mkdtemp(
      path.join(path.dirname(path.resolve(outputPath)), 'fetch-'),
    );
    try {
      await res.dir({ targetDir: stagingDir });

      // The .git directory of the task workspace is owned by the scaffolder's
      // own git operations, so fetched content must not contain one either.
      // Archives hosted on object stores can carry a .git directory through
      // this extraction, which repository archives served by SCM hosts never
      // do, so the extracted tree is checked once it is on disk.
      if (await directoryTreeContainsGitDirectory(stagingDir)) {
        throw new InputError(
          `the content fetched from ${readUrl} contains a .git directory`,
        );
      }
      await fs.copy(stagingDir, outputPath);
    } finally {
      await fs.remove(stagingDir);
    }
  }
}

async function directoryTreeContainsGitDirectory(
  dir: string,
): Promise<boolean> {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    // Symlinked directories are not followed; they are reported as
    // symlinks by readdir and are not treated as directories here
    if (entry.isDirectory()) {
      if (entry.name.toLowerCase() === '.git') {
        return true;
      }
      if (await directoryTreeContainsGitDirectory(path.join(dir, entry.name))) {
        return true;
      }
    }
  }
  return false;
}

/**
 * A helper function that reads the content of a single file from the given URL.
 * Can be used in your own actions, and also used behind `fetch:plain:file`
 *
 * @public
 */
export async function fetchFile(options: {
  reader: UrlReaderService;
  integrations: ScmIntegrations;
  baseUrl?: string;
  fetchUrl?: string;
  outputPath: string;
  token?: string;
}) {
  const {
    reader,
    integrations,
    baseUrl,
    fetchUrl = '.',
    outputPath,
    token,
  } = options;

  const fetchUrlIsAbsolute = isFetchUrlAbsolute(fetchUrl);

  // We handle both file locations and url ones
  if (!fetchUrlIsAbsolute && baseUrl?.startsWith('file://')) {
    const basePath = baseUrl.slice('file://'.length);
    const src = resolveSafeChildPath(path.dirname(basePath), fetchUrl);
    await fs.copyFile(src, outputPath);
  } else {
    const readUrl = getReadUrl(fetchUrl, baseUrl, integrations);

    const res = await reader.readUrl(readUrl, { token });
    await fs.ensureDir(path.dirname(outputPath));
    const buffer = await res.buffer();
    await fs.outputFile(outputPath, buffer);
  }
}

function isFetchUrlAbsolute(fetchUrl: string) {
  let fetchUrlIsAbsolute = false;
  try {
    // eslint-disable-next-line no-new
    new URL(fetchUrl);
    fetchUrlIsAbsolute = true;
  } catch {
    /* ignored */
  }
  return fetchUrlIsAbsolute;
}

function getReadUrl(
  fetchUrl: string,
  baseUrl: string | undefined,
  integrations: ScmIntegrations,
) {
  if (isFetchUrlAbsolute(fetchUrl)) {
    return fetchUrl;
  } else if (baseUrl) {
    const integration = integrations.byUrl(baseUrl);
    if (!integration) {
      throw new InputError(`No integration found for location ${baseUrl}`);
    }

    return integration.resolveUrl({
      url: fetchUrl,
      base: baseUrl,
    });
  }
  throw new InputError(
    `Failed to fetch, template location could not be determined and the fetch URL is relative, ${fetchUrl}`,
  );
}
