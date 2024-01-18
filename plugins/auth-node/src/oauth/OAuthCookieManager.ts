/*
 * Copyright 2023 The Backstage Authors
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

import { Request, Response } from 'express';
import { CookieConfigurer } from '../types';

const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
const TEN_MINUTES_MS = 600 * 1000;

const defaultCookieConfigurer: CookieConfigurer = ({
  callbackUrl,
  providerId,
  appOrigin,
}) => {
  const { hostname: domain, pathname, protocol } = new URL(callbackUrl);
  const secure = protocol === 'https:';

  // For situations where the auth-backend is running on a
  // different domain than the app, we set the SameSite attribute
  // to 'none' to allow third-party access to the cookie, but
  // only if it's in a secure context (https).
  let sameSite: ReturnType<CookieConfigurer>['sameSite'] = 'lax';
  if (new URL(appOrigin).hostname !== domain && secure) {
    sameSite = 'none';
  }

  // If the provider supports callbackUrls, the pathname will
  // contain the complete path to the frame handler so we need
  // to slice off the trailing part of the path.
  const path = pathname.endsWith(`${providerId}/handler/frame`)
    ? pathname.slice(0, -'/handler/frame'.length)
    : `${pathname}/${providerId}`;

  return { domain, path, secure, sameSite };
};

/** @internal */
export class OAuthCookieManager {
  private readonly cookieConfigurer: CookieConfigurer;
  private readonly nonceCookie: string;
  private readonly refreshTokenCookie: string;
  private readonly grantedScopeCookie: string;

  constructor(
    private readonly options: {
      providerId: string;
      defaultAppOrigin: string;
      baseUrl: string;
      callbackUrl: string;
      cookieConfigurer?: CookieConfigurer;
    },
  ) {
    this.cookieConfigurer = options.cookieConfigurer ?? defaultCookieConfigurer;

    this.nonceCookie = `${options.providerId}-nonce`;
    this.refreshTokenCookie = `${options.providerId}-refresh-token`;
    this.grantedScopeCookie = `${options.providerId}-granted-scope`;
  }

  private getConfig(origin?: string, pathSuffix: string = '') {
    const cookieConfig = this.cookieConfigurer({
      providerId: this.options.providerId,
      baseUrl: this.options.baseUrl,
      callbackUrl: this.options.callbackUrl,
      appOrigin: origin ?? this.options.defaultAppOrigin,
    });
    return {
      httpOnly: true,
      sameSite: 'lax' as const,
      ...cookieConfig,
      path: cookieConfig.path + pathSuffix,
    };
  }

  setNonce(res: Response, nonce: string, origin?: string) {
    res.cookie(this.nonceCookie, nonce, {
      maxAge: TEN_MINUTES_MS,
      ...this.getConfig(origin, '/handler'),
    });
  }

  setRefreshToken(res: Response, refreshToken: string, origin?: string) {
    res.cookie(this.refreshTokenCookie, refreshToken, {
      maxAge: THOUSAND_DAYS_MS,
      ...this.getConfig(origin),
    });
  }

  removeRefreshToken(res: Response, origin?: string) {
    res.cookie(this.refreshTokenCookie, '', {
      maxAge: 0,
      ...this.getConfig(origin),
    });
  }

  setGrantedScopes(res: Response, scope: string, origin?: string) {
    res.cookie(this.grantedScopeCookie, scope, {
      maxAge: THOUSAND_DAYS_MS,
      ...this.getConfig(origin),
    });
  }

  getNonce(req: Request) {
    return req.cookies[this.nonceCookie];
  }

  getRefreshToken(req: Request) {
    return req.cookies[this.refreshTokenCookie];
  }

  getGrantedScopes(req: Request) {
    return req.cookies[this.grantedScopeCookie];
  }
}
