/*
 * Copyright 2025 The Backstage Authors
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

import { parseEntityRef } from '@backstage/catalog-model';
import { AuthenticationError } from '@backstage/errors';
import {
  BackstageSignInResult,
  TokenParams,
  tokenTypes,
} from '@backstage/plugin-auth-node';
import { omit } from 'lodash';
import { LoggerService } from '@backstage/backend-plugin-api';
import { GeneralSign, importJWK, JWK, KeyLike, SignJWT } from 'jose';
import { BackstageTokenPayload } from './TokenFactory';

const MS_IN_S = 1000;
const MAX_TOKEN_LENGTH = 32768; // At 64 bytes per entity ref this still leaves room for about 500 entities

export async function issueUserToken({
  issuer,
  key,
  keyDurationSeconds,
  logger,
  omitClaimsFromToken,
  params,
}: {
  issuer: string;
  key: JWK;
  keyDurationSeconds: number;
  logger: LoggerService;
  omitClaimsFromToken?: string[];
  params: TokenParams & { claims: { ent: string[] } };
}): Promise<BackstageSignInResult> {
  const { sub, ent, ...additionalClaims } = params.claims;
  const aud = tokenTypes.user.audClaim;
  const iat = Math.floor(Date.now() / MS_IN_S);
  const exp = iat + keyDurationSeconds;

  try {
    // The subject must be a valid entity ref
    parseEntityRef(sub);
  } catch (error) {
    throw new Error(
      '"sub" claim provided by the auth resolver is not a valid EntityRef.',
    );
  }

  if (!key.alg) {
    throw new AuthenticationError('No algorithm was provided in the key');
  }

  logger.info(`Issuing token for ${sub}, with entities ${ent}`);

  const signingKey = await importJWK(key);

  const uip = await createUserIdentityClaim({
    header: {
      typ: tokenTypes.limitedUser.typParam,
      alg: key.alg,
      kid: key.kid,
    },
    payload: { sub, iat, exp },
    key: signingKey,
  });

  const claims: BackstageTokenPayload = {
    ...additionalClaims,
    iss: issuer,
    sub,
    ent,
    aud,
    iat,
    exp,
    uip,
  };

  const tokenClaims = omitClaimsFromToken
    ? omit(claims, omitClaimsFromToken)
    : claims;
  const token = await new SignJWT(tokenClaims)
    .setProtectedHeader({
      typ: tokenTypes.user.typParam,
      alg: key.alg,
      kid: key.kid,
    })
    .sign(signingKey);

  if (token.length > MAX_TOKEN_LENGTH) {
    throw new Error(
      `Failed to issue a new user token. The resulting token is excessively large, with either too many ownership claims or too large custom claims. You likely have a bug either in the sign-in resolver or catalog data. The following claims were requested: '${JSON.stringify(
        tokenClaims,
      )}'`,
    );
  }

  return {
    token,
    identity: {
      type: 'user',
      userEntityRef: sub,
      ownershipEntityRefs: ent,
    },
  };
}

/**
 * The payload contents of a valid Backstage user identity claim token
 *
 * @internal
 */
interface BackstageUserIdentityProofPayload {
  /**
   * The entity ref of the user
   */
  sub: string;

  /**
   * Standard expiry in epoch seconds
   */
  exp: number;

  /**
   * Standard issue time in epoch seconds
   */
  iat: number;
}

/**
 * Creates a string claim that can be used as part of reconstructing a limited
 * user token. The output of this function is only the signature part of a JWS.
 */
async function createUserIdentityClaim(options: {
  header: {
    typ: string;
    alg: string;
    kid?: string;
  };
  payload: BackstageUserIdentityProofPayload;
  key: KeyLike | Uint8Array;
}): Promise<string> {
  // NOTE: We reconstruct the header and payload structures carefully to
  // perfectly guarantee ordering. The reason for this is that we store only
  // the signature part of these to reduce duplication within the Backstage
  // token. Anyone who wants to make an actual JWT based on all this must be
  // able to do the EXACT reconstruction of the header and payload parts, to
  // then append the signature.

  const header = {
    typ: options.header.typ,
    alg: options.header.alg,
    ...(options.header.kid ? { kid: options.header.kid } : {}),
  };

  const payload = {
    sub: options.payload.sub,
    iat: options.payload.iat,
    exp: options.payload.exp,
  };

  const jws = await new GeneralSign(
    new TextEncoder().encode(JSON.stringify(payload)),
  )
    .addSignature(options.key)
    .setProtectedHeader(header)
    .done()
    .sign();

  return jws.signatures[0].signature;
}
