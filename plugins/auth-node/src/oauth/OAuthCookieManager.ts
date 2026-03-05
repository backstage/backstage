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

import { CookieOptions, Request, Response } from 'express';
import { CookieConfigurer } from '../types';
import { HumanDuration, durationToMilliseconds } from '@backstage/types';

const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
const TEN_MINUTES_MS = 600 * 1000;

const MAX_COOKIE_SIZE_CHARACTERS = 4000;

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

  return { path, secure, sameSite };
};

/** @internal */
export class OAuthCookieManager {
  private readonly cookieConfigurer: CookieConfigurer;
  private readonly nonceCookie: string;
  private readonly refreshTokenCookie: string;
  private readonly grantedScopeCookie: string;
  private readonly maxAge: number;

  constructor(
    private readonly options: {
      providerId: string;
      defaultAppOrigin: string;
      baseUrl: string;
      callbackUrl: string;
      cookieConfigurer?: CookieConfigurer;
      sessionDuration?: HumanDuration;
    },
  ) {
    this.cookieConfigurer = options.cookieConfigurer ?? defaultCookieConfigurer;

    this.nonceCookie = `${options.providerId}-nonce`;
    this.refreshTokenCookie = `${options.providerId}-refresh-token`;
    this.grantedScopeCookie = `${options.providerId}-granted-scope`;
    this.maxAge = options.sessionDuration
      ? durationToMilliseconds(options.sessionDuration)
      : THOUSAND_DAYS_MS;
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

  setNonce(res: Response, nonce: string, origin?: string): void {
    this.setCookie(
      res,
      this.nonceCookie,
      nonce,
      TEN_MINUTES_MS,
      origin,
      '/handler',
    );
  }

  setRefreshToken(res: Response, refreshToken: string, origin?: string): void {
    this.setCookie(
      res,
      this.refreshTokenCookie,
      refreshToken,
      this.maxAge,
      origin,
    );
  }

  removeRefreshToken(res: Response, origin?: string): void {
    this.removeCookie(res, this.refreshTokenCookie, origin);
  }

  removeGrantedScopes(res: Response, origin?: string): void {
    this.removeCookie(res, this.grantedScopeCookie, origin);
  }

  setGrantedScopes(res: Response, scope: string, origin?: string): void {
    this.setCookie(res, this.grantedScopeCookie, scope, this.maxAge, origin);
  }

  getNonce(req: Request): string | undefined {
    return this.getCookie(req, this.nonceCookie);
  }

  getRefreshToken(req: Request): string | undefined {
    return this.getCookie(req, this.refreshTokenCookie);
  }

  getGrantedScopes(req: Request): string | undefined {
    return this.getCookie(req, this.grantedScopeCookie);
  }

  private setCookie(
    res: Response,
    name: string,
    val: string,
    maxAge: number,
    origin?: string,
    pathSuffix: string = '',
  ): void {
    const options = {
      maxAge,
      ...this.getConfig(origin, pathSuffix),
    };
    const req = res.req;

    const newCookieShouldBeChunked = val.length > MAX_COOKIE_SIZE_CHARACTERS;
    const existingChunkCount = OAuthCookieManager.countExistingCookieChunks(
      req,
      name,
    );
    const chunkedFormatExists = existingChunkCount > 0;

    // If using the default cookieConfigurer, delete old cookie with domain
    // explicitly set to the callbackUrl's domain (legacy behavior)
    if (this.cookieConfigurer === defaultCookieConfigurer) {
      this.removeLegacyCookieWithDomain(res, name, existingChunkCount);
    }

    if (chunkedFormatExists) {
      this.removeChunkedCookie(res, name, existingChunkCount);
    }

    if (newCookieShouldBeChunked) {
      this.setChunkedCookie(req, res, name, val, options);
    } else {
      res.cookie(name, val, options);
    }
  }

  private removeLegacyCookieWithDomain(
    res: Response,
    name: string,
    chunkCount: number,
  ): void {
    const { hostname: domain } = new URL(this.options.callbackUrl);
    res.cookie(name, '', {
      ...this.getRemoveCookieOptions(),
      domain: domain,
    });

    this.removeChunkedCookie(res, name, chunkCount, { domain });
  }

  private setChunkedCookie(
    req: Request,
    res: Response,
    name: string,
    val: string,
    options: CookieOptions,
  ): void {
    const nonChunkedFormatExists = !!req.cookies[name];
    if (nonChunkedFormatExists) {
      res.cookie(name, '', this.getRemoveCookieOptions());
    }
    const chunkedCookieArray = this.splitCookieToChunks(
      val,
      MAX_COOKIE_SIZE_CHARACTERS,
    );
    chunkedCookieArray.forEach((chunkValue, chunkNumber) => {
      res.cookie(
        OAuthCookieManager.getCookieChunkName(name, chunkNumber),
        chunkValue,
        options,
      );
    });
  }

  private getCookie(req: Request, name: string): string | undefined {
    const existingChunkCount = OAuthCookieManager.countExistingCookieChunks(
      req,
      name,
    );
    const isChunked = existingChunkCount > 0;
    if (isChunked) {
      return this.getChunkedCookie(req, name, existingChunkCount);
    }
    return req.cookies[name];
  }

  private getChunkedCookie(
    req: Request,
    name: string,
    chunkCount: number,
  ): string | undefined {
    const chunkedCookieArray: string[] = [];
    for (let chunkNumber = 0; chunkNumber < chunkCount; chunkNumber++) {
      const chunk =
        req.cookies[OAuthCookieManager.getCookieChunkName(name, chunkNumber)];
      chunkedCookieArray.push(chunk);
    }
    return chunkedCookieArray.join('');
  }

  private removeCookie(res: Response, name: string, origin?: string): void {
    const req = res.req;
    const existingChunkCount = OAuthCookieManager.countExistingCookieChunks(
      req,
      name,
    );
    const chunkedFormatExists = existingChunkCount > 0;
    const nonChunkedFormatExists = !!req.cookies[name];

    if (nonChunkedFormatExists) {
      res.cookie(name, '', this.getRemoveCookieOptions(origin));
    }
    if (chunkedFormatExists) {
      this.removeChunkedCookie(res, name, existingChunkCount, {
        origin,
      });
    }
  }

  private removeChunkedCookie(
    res: Response,
    name: string,
    chunkCount: number,
    { domain, origin }: { domain?: string; origin?: string } = {},
  ): void {
    for (let chunkNumber = 0; chunkNumber < chunkCount; chunkNumber++) {
      const key = OAuthCookieManager.getCookieChunkName(name, chunkNumber);
      const baseOptions = this.getRemoveCookieOptions(origin);
      const options = domain ? { ...baseOptions, domain } : baseOptions;
      res.cookie(key, '', options);
    }
  }

  private splitCookieToChunks(val: string, chunkSize: number): string[] {
    const numChunks = Math.ceil(val.length / chunkSize);
    const chunkedCookieArray: string[] = Array<string>(numChunks);

    let offset: number = 0;
    for (let i = 0; i < numChunks; i++) {
      chunkedCookieArray[i] = val.substring(offset, offset + chunkSize);
      offset += chunkSize;
    }
    return chunkedCookieArray;
  }

  private static countExistingCookieChunks(req: Request, name: string): number {
    for (let chunkNumber = 0; ; chunkNumber++) {
      const key = OAuthCookieManager.getCookieChunkName(name, chunkNumber);
      const exists = !!req.cookies[key];
      if (!exists) {
        return chunkNumber;
      }
    }
  }

  private static getCookieChunkName(name: string, chunkIndex: number): string {
    return `${name}-${chunkIndex}`;
  }

  private getRemoveCookieOptions(origin?: string): CookieOptions {
    return {
      maxAge: 0,
      ...this.getConfig(origin),
    };
  }
}
