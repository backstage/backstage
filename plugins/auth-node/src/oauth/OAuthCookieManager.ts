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

  return { domain, path, secure, sameSite };
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
  ): Response {
    const options = {
      maxAge,
      ...this.getConfig(origin, pathSuffix),
    };
    const req = res.req;
    let output = res;
    if (val.length > MAX_COOKIE_SIZE_CHARACTERS) {
      const nonChunkedFormatExists = !!req.cookies[name];
      if (nonChunkedFormatExists) {
        output = output.cookie(name, '', this.getRemoveCookieOptions());
      }

      const chunked = this.splitCookieToChunks(val, MAX_COOKIE_SIZE_CHARACTERS);
      chunked.forEach((value, chunkNumber) => {
        output = output.cookie(
          OAuthCookieManager.getCookieChunkName(name, chunkNumber),
          value,
          options,
        );
      });
      return output;
    }

    const chunkedFormatExists = OAuthCookieManager.chunkedCookieExists(
      req,
      name,
    );
    if (chunkedFormatExists) {
      for (let chunkNumber = 0; ; chunkNumber++) {
        const key = OAuthCookieManager.getCookieChunkName(name, chunkNumber);
        const exists = !!req.cookies[key];
        if (!exists) {
          break;
        }
        output = output.cookie(key, '', this.getRemoveCookieOptions());
      }
    }

    return output.cookie(name, val, options);
  }

  private getCookie(req: Request, name: string): string | undefined {
    const isChunked = OAuthCookieManager.chunkedCookieExists(req, name);
    if (isChunked) {
      const chunks: string[] = [];
      let chunkNumber = 0;
      let chunk =
        req.cookies[OAuthCookieManager.getCookieChunkName(name, chunkNumber)];
      while (chunk) {
        chunks.push(chunk);
        chunkNumber++;
        chunk =
          req.cookies[OAuthCookieManager.getCookieChunkName(name, chunkNumber)];
      }
      return chunks.join('');
    }
    return req.cookies[name];
  }

  private removeCookie(res: Response, name: string, origin?: string): Response {
    const req = res.req;
    const options = this.getRemoveCookieOptions(origin);
    const isChunked = OAuthCookieManager.chunkedCookieExists(req, name);
    if (isChunked) {
      const nonChunkedFormatExists = !!req.cookies[name];
      let output: Response = nonChunkedFormatExists
        ? res.cookie(name, '', options)
        : res;
      for (let chunkNumber = 0; ; chunkNumber++) {
        const key = OAuthCookieManager.getCookieChunkName(name, chunkNumber);
        const exists = !!req.cookies[key];
        if (!exists) {
          break;
        }
        output = output.cookie(key, '', options);
      }
      return output;
    }
    return res.cookie(name, '', options);
  }

  private splitCookieToChunks(val: string, chunkSize: number): string[] {
    const numChunks = Math.ceil(val.length / chunkSize);
    const chunks: string[] = Array<string>(numChunks);

    let offset: number = 0;
    for (let i = 0; i < numChunks; i++) {
      chunks[i] = val.substring(offset, offset + chunkSize);
      offset += chunkSize;
    }
    return chunks;
  }

  private static chunkedCookieExists(req: Request, name: string): boolean {
    return !!req.cookies[OAuthCookieManager.getCookieChunkName(name, 0)];
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
