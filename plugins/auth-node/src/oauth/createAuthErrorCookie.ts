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
import { Response } from 'express';
import { CookieConfigurer } from '../types';
import { serializeError } from '@backstage/errors';

const ONE_MINUTE_MS = 60 * 1000;

const AUTH_ERROR_COOKIE = 'auth-error';

function configureAuthErrorCookie(redirectUrl: string, appOrigin: string) {
  const { hostname: domain, pathname: path, protocol } = new URL(redirectUrl);
  const secure = protocol === 'https:';

  // For situations where the auth-backend is running on a
  // different domain than the app, we set the SameSite attribute
  // to 'none' to allow third-party access to the cookie, but
  // only if it's in a secure context (https).
  let sameSite: ReturnType<CookieConfigurer>['sameSite'] = 'lax';
  if (new URL(appOrigin).hostname !== domain && secure) {
    sameSite = 'none';
  }

  return { domain, path, secure, sameSite };
}

export function createAuthErrorCookie(
  res: Response,
  origin: string,
  options: {
    error: Error;
    redirectUrl: string;
  },
) {
  const { error, redirectUrl } = options;
  const jsonData = serializeError(error);

  res.cookie(AUTH_ERROR_COOKIE, jsonData, {
    maxAge: ONE_MINUTE_MS,
    httpOnly: true,
    ...configureAuthErrorCookie(redirectUrl, origin),
  });
}
