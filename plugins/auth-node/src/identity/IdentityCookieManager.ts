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
import { URL } from 'url';
import {
  BACKSTAGE_AUTH_COOKIE_NAME,
  BackstageIdentityResponse,
  CookieConfigurer,
} from '../types';

export class IdentityCookieManager {
  #backendBaseUrl: string;
  #defaultAppOrigin: string;

  constructor(options: { backendBaseUrl: string; defaultAppOrigin: string }) {
    this.#backendBaseUrl = options.backendBaseUrl;
    this.#defaultAppOrigin = options.defaultAppOrigin;
  }

  setIdentityCookie(
    res: Response,
    options: {
      backstageIdentity: BackstageIdentityResponse;
      appOrigin?: string;
    },
  ) {
    const { backstageIdentity, appOrigin } = options;

    res.cookie(BACKSTAGE_AUTH_COOKIE_NAME, backstageIdentity.token, {
      ...this.#getCookieOptions(appOrigin),
      maxAge: backstageIdentity.expiresInSeconds
        ? backstageIdentity.expiresInSeconds * 1000
        : 24 * 60 * 60 * 1000, // 24h max,
    });
  }

  removeIdentityCookie(res: Response, options: { appOrigin?: string }) {
    const { appOrigin } = options;

    res.clearCookie(
      BACKSTAGE_AUTH_COOKIE_NAME,
      this.#getCookieOptions(appOrigin),
    );
  }

  #getCookieOptions(appOrigin: string = this.#defaultAppOrigin) {
    const { hostname: domain, protocol } = new URL(this.#backendBaseUrl);
    const secure = protocol === 'https:';

    // For situations where the auth-backend is running on a
    // different domain than the app, we set the SameSite attribute
    // to 'none' to allow third-party access to the cookie, but
    // only if it's in a secure context (https).
    let sameSite: ReturnType<CookieConfigurer>['sameSite'] = 'lax';
    if (new URL(appOrigin).hostname !== domain && secure) {
      sameSite = 'none';
    }

    return {
      httpOnly: true,
      secure,
      sameSite,
    };
  }
}
