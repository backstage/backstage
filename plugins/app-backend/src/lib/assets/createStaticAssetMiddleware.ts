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

import { extname } from 'path';
import { RequestHandler } from 'express';
import { StaticAssetProvider } from './types';
import { CACHE_CONTROL_MAX_CACHE } from '../headers';

/**
 * Creates a middleware that serves static assets from a static asset provider
 *
 * @internal
 */
export function createStaticAssetMiddleware(
  store: StaticAssetProvider,
): RequestHandler {
  return (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }

    // Let's not assume we're in promise-router
    Promise.resolve(
      (async () => {
        // Drop leading slashes from the incoming path
        const path = req.path.startsWith('/') ? req.path.slice(1) : req.path;

        const asset = await store.getAsset(path);
        if (!asset) {
          next();
          return;
        }

        // Set the Content-Type header, falling back to octet-stream
        const ext = extname(asset.path);
        if (ext) {
          res.type(ext);
        } else {
          res.type('bin');
        }

        // Same as our express.static override
        res.setHeader('Cache-Control', CACHE_CONTROL_MAX_CACHE);
        res.setHeader('Last-Modified', asset.lastModifiedAt.toUTCString());

        res.send(asset.content);
      })(),
    ).catch(next);
  };
}
