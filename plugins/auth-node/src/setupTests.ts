/*
 * Copyright 2020 The Backstage Authors
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

import { Handler, Request, Response } from 'express';
import { ErrorLike } from '@backstage/errors';
import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import { v4 as uuid } from 'uuid';

export const useFixture =
  (middleware: Handler) => async (req: Partial<Request>) => {
    let error: ErrorLike | undefined;

    await new Promise<void>(resolve => {
      middleware(req as Request, {} as Response, (err: any) => {
        error = err;
        resolve();
      });
    });

    return error;
  };

interface AnyJWK extends Record<string, string> {
  use: 'sig';
  alg: string;
  kid: string;
  kty: string;
}

// Simplified copy of TokenFactory in @backstage/plugin-auth-backend

export class FakeTokenFactory {
  private readonly keys = new Array<AnyJWK>();

  constructor(
    private readonly options: {
      issuer: string;
      keyDurationSeconds: number;
    },
  ) {}

  async issueToken(params?: {
    issuer?: string;
    audience?: string;
    expiresAt?: number;
    claims?: {
      sub?: string;
      ent?: string[];
    };
  }): Promise<string> {
    const pair = await generateKeyPair('ES256');
    const publicKey = await exportJWK(pair.publicKey);
    const kid = uuid();
    publicKey.kid = kid;
    this.keys.push(publicKey as AnyJWK);

    const iss = params?.issuer ?? this.options.issuer;
    const sub = params?.claims?.sub ?? 'foo';
    const ent = params?.claims?.ent ?? [];
    const aud = params?.audience ?? 'backstage';
    const iat = Math.floor(Date.now() / 1000);
    const exp = params?.expiresAt ?? iat + this.options.keyDurationSeconds;

    return new SignJWT({ iss, sub, aud, iat, exp, ent, kid })
      .setProtectedHeader({ alg: 'ES256', ent: ent, kid: kid })
      .setIssuer(iss)
      .setAudience(aud)
      .setSubject(sub)
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(pair.privateKey);
  }

  async listPublicKeys(): Promise<{ keys: AnyJWK[] }> {
    return { keys: this.keys };
  }
}
