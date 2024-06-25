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

import { AuthService, HttpAuthService } from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';

const WELL_KNOWN_COOKIE_PATH_V1 = '/.backstage/auth/v1/cookie';

/**
 * @public
 * Creates a middleware that can be used to refresh the cookie for the user.
 */
export function createCookieAuthRefreshMiddleware(options: {
  auth: AuthService;
  httpAuth: HttpAuthService;
}) {
  const { auth, httpAuth } = options;
  const router = Router();

  // Endpoint that sets the cookie for the user
  router.get(WELL_KNOWN_COOKIE_PATH_V1, async (_, res) => {
    const { expiresAt } = await httpAuth.issueUserCookie(res);
    res.json({ expiresAt: expiresAt.toISOString() });
  });

  // Endpoint that removes the cookie for the user
  router.delete(WELL_KNOWN_COOKIE_PATH_V1, async (_, res) => {
    const credentials = await auth.getNoneCredentials();
    await httpAuth.issueUserCookie(res, { credentials });
    res.status(204).end();
  });

  return router;
}
