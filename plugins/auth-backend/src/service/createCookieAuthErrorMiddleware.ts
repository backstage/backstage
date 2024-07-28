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

import Router from 'express-promise-router';

const AUTH_ERROR_COOKIE = 'auth-error';

/**
 * @public
 * Creates a middleware that can be used to get auth errors in redirect flow
 */
export function createCookieAuthErrorMiddleware(authUrl: string) {
  const router = Router();

  router.get('/.backstage/error', async (req, res) => {
    const error = req.cookies[AUTH_ERROR_COOKIE];
    if (error) {
      const { hostname: domain } = new URL(authUrl);

      res.clearCookie('auth-error', {
        path: '/api/auth/.backstage/error',
        domain,
      });
      res.status(200).json(error);
    } else {
      res.status(404);
    }
  });

  return router;
}
