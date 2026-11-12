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

import {
  LoggerService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { JsonObject } from '@backstage/types';
import express from 'express';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ManifestFileName } from '@module-federation/sdk';
import { Remote } from '../schema/openapi/generated/models';
import {
  BACKSTAGE_MANIFEST_FILE_NAME,
  readBackstageManifest,
} from './backstageManifest';

/**
 * The directory in the output directory of the app that the Backstage CLI
 * builds the remotes of deferred app packages into.
 */
const APP_REMOTES_DIR = 'remotes';

type AppRemote = {
  remote: Remote;
  handler: express.Handler;
};

function readJson(location: string): JsonObject | undefined {
  try {
    const content = JSON.parse(fs.readFileSync(location, 'utf8'));
    return typeof content === 'object' && content !== null
      ? content
      : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Finds the directory of the remotes of the app, or undefined if the app
 * package can't be found, which means that the backend doesn't serve an app.
 */
export function resolveAppRemotesDir(
  appPackageName: string,
): string | undefined {
  try {
    return resolvePackagePath(appPackageName, 'dist', APP_REMOTES_DIR);
  } catch {
    return undefined;
  }
}

/**
 * Serves the module federation remotes that the Backstage CLI builds for the
 * packages of the app whose plugins can be deferred, which the CLI leaves out
 * of the app bundle.
 *
 * @remarks
 *
 * The remotes directory is read again each time the remotes are listed,
 * since the app can be built or started after the backend has started.
 */
export function createAppRemotes(options: {
  remotesDir: string;
  externalBaseUrl: string;
  logger: LoggerService;
}) {
  const { remotesDir, externalBaseUrl, logger } = options;
  let remotes = new Map<string, AppRemote>();

  function readRemote(dir: string): AppRemote | undefined {
    const backstageManifest = readJson(
      path.resolve(dir, BACKSTAGE_MANIFEST_FILE_NAME),
    );
    const mfManifest = readJson(path.resolve(dir, ManifestFileName));
    const packageName = backstageManifest?.packageName;
    if (typeof packageName !== 'string' || !mfManifest) {
      logger.warn(
        `Ignoring the app remote in '${dir}', since it has no valid ${BACKSTAGE_MANIFEST_FILE_NAME} or ${ManifestFileName}`,
      );
      return undefined;
    }
    if (typeof mfManifest.name !== 'string') {
      logger.warn(
        `Ignoring the app remote of '${packageName}', since its ${ManifestFileName} has no name`,
      );
      return undefined;
    }
    const exposes = Array.isArray(mfManifest.exposes) ? mfManifest.exposes : [];
    const frontendManifest = readBackstageManifest({
      assetsPath: dir,
      mfManifest,
      logger,
      pluginName: packageName,
    });
    return {
      remote: {
        packageName,
        remoteInfo: {
          name: mfManifest.name,
          entry: `${externalBaseUrl}/remotes/${packageName}/${ManifestFileName}`,
        },
        exposedModules: exposes.flatMap(e =>
          e &&
          typeof e === 'object' &&
          'name' in e &&
          typeof e.name === 'string'
            ? [e.name]
            : [],
        ),
        ...(frontendManifest ? { frontendManifest } : {}),
      },
      handler: express.static(dir),
    };
  }

  function refresh() {
    const next = new Map<string, AppRemote>();
    const entries = fs.existsSync(remotesDir)
      ? fs.readdirSync(remotesDir, { withFileTypes: true })
      : [];
    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }
      const appRemote = readRemote(path.resolve(remotesDir, entry.name));
      if (appRemote) {
        next.set(appRemote.remote.packageName, appRemote);
      }
    }
    remotes = next;
  }

  function findHandler(requestPath: string) {
    for (const [packageName, { handler }] of remotes) {
      const prefix = `/${packageName}/`;
      if (requestPath.startsWith(prefix)) {
        return { handler, prefix };
      }
    }
    return undefined;
  }

  const router = express.Router();
  router.use('/remotes', (req, res, next) => {
    // The remotes are read again if the asset is requested before they are
    // listed, for example after the backend has restarted
    let match = findHandler(req.path);
    if (!match) {
      refresh();
      match = findHandler(req.path);
    }
    if (!match) {
      next();
      return;
    }
    req.url = req.url.slice(match.prefix.length - 1);
    match.handler(req, res, next);
  });

  return {
    router,
    /** Lists the remotes of the app, after reading the remotes directory. */
    list(): Remote[] {
      refresh();
      return [...remotes.values()].map(({ remote }) => remote);
    },
  };
}
