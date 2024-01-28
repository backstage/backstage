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
import { getBearerTokenFromAuthorizationHeader } from '@backstage/plugin-auth-node';
import { NextFunction, Request, Response } from 'express';
import { decodeJwt } from 'jose';
import { URL } from 'url';
import lzstring from 'lz-string';

function setTokenCookie(
  res: Response,
  options: { token: string; secure: boolean; cookieDomain: string },
) {
  try {
    const payload = decodeJwt(options.token);
    res.cookie('token', options.token, {
      encode: lzstring.compressToEncodedURIComponent,
      expires: new Date(payload.exp ? payload.exp * 1000 : 0),
      secure: options.secure,
      sameSite: 'lax',
      domain: options.cookieDomain,
      path: '/',
      httpOnly: false,
    });
  } catch (_err) {
    // Ignore
  }
}

export const cookieMiddlewareFactory = (baseUrl: string) => {
  const secure = baseUrl.startsWith('https://');
  const cookieDomain = new URL(baseUrl).hostname;
  return (req: Request, res: Response, next: NextFunction) => {
    // Token cookies are compressed to reduce size
    const cookieToken = lzstring.decompressFromEncodedURIComponent(
      req.cookies.token ?? '',
    );
    const token =
      getBearerTokenFromAuthorizationHeader(req.headers.authorization) ??
      cookieToken;

    if (!req.headers.authorization) {
      req.headers.authorization = `Bearer ${token}`;
    }
    if (token && token !== req.cookies?.token) {
      setTokenCookie(res, {
        token,
        secure,
        cookieDomain,
      });
    }
    next();
  };
};
