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
import { KeyObject } from 'crypto';
import * as crypto from 'crypto';
import { JWTHeaderParameters, decodeJwt } from 'jose';
import NodeCache from 'node-cache';
import fetch from 'node-fetch';
import { PassportProfile, ProfileInfo } from '@backstage/plugin-auth-node';
import { AuthenticationError } from '@backstage/errors';

export const makeProfileInfo = (
  profile: PassportProfile,
  idToken?: string,
): ProfileInfo => {
  let email: string | undefined = undefined;
  if (profile.emails && profile.emails.length > 0) {
    const [firstEmail] = profile.emails;
    email = firstEmail.value;
  }

  let picture: string | undefined = undefined;
  if (profile.avatarUrl) {
    picture = profile.avatarUrl;
  } else if (profile.photos && profile.photos.length > 0) {
    const [firstPhoto] = profile.photos;
    picture = firstPhoto.value;
  }

  let displayName: string | undefined =
    profile.displayName ?? profile.username ?? profile.id;

  if ((!email || !picture || !displayName) && idToken) {
    try {
      const decoded: Record<string, string> = decodeJwt(idToken) as {
        email?: string;
        picture?: string;
        name?: string;
      };
      if (!email && decoded.email) {
        email = decoded.email;
      }
      if (!picture && decoded.picture) {
        picture = decoded.picture;
      }
      if (!displayName && decoded.name) {
        displayName = decoded.name;
      }
    } catch (e) {
      throw new Error(`Failed to parse id token and get profile info, ${e}`);
    }
  }

  return {
    email,
    picture,
    displayName,
  };
};

export const provisionKeyCache = (region: string, keyCache: NodeCache) => {
  return async (header: JWTHeaderParameters): Promise<KeyObject> => {
    if (!header.kid) {
      throw new AuthenticationError('No key id was specified in header');
    }
    const optionalCacheKey = keyCache.get<KeyObject>(header.kid);
    if (optionalCacheKey) {
      return crypto.createPublicKey(optionalCacheKey);
    }
    const keyText: string = await fetch(
      `https://public-keys.auth.elb.${encodeURIComponent(
        region,
      )}.amazonaws.com/${encodeURIComponent(header.kid)}`,
    ).then(response => response.text());

    const keyValue = crypto.createPublicKey(keyText);
    keyCache.set(header.kid, keyValue.export({ format: 'pem', type: 'spki' }));
    return keyValue;
  };
};
