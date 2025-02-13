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

import { Request } from 'express';
import { decodeJwt } from 'jose';
import { Strategy } from 'passport';
import { PassportProfile } from './types';
import { ProfileInfo } from '../types';
import { ForwardedError } from '@backstage/errors';

// Re-declared here to avoid direct dependency on passport-oauth2
/** @internal */
interface InternalOAuthError extends Error {
  oauthError?: {
    data?: string;
  };
}

/** @public */
export class PassportHelpers {
  private constructor() {}

  static transformProfile = (
    profile: PassportProfile,
    idToken?: string,
  ): ProfileInfo => {
    let email: string | undefined = undefined;
    if (profile.emails && profile.emails.length > 0) {
      const [firstEmail] = profile.emails;
      email = firstEmail.value;
    } else if (profile.email) {
      // This is the case for Atlassian
      email = profile.email;
    }

    let picture: string | undefined = undefined;
    if (profile.avatarUrl) {
      picture = profile.avatarUrl;
    } else if (profile.photos && profile.photos.length > 0) {
      const [firstPhoto] = profile.photos;
      picture = firstPhoto.value;
    } else if (profile.photo) {
      // This is the case for Atlassian
      picture = profile.photo;
    }

    let displayName: string | undefined =
      profile.displayName ?? profile.username ?? profile.id;

    if ((!email || !picture || !displayName) && idToken) {
      try {
        const decoded = decodeJwt(idToken) as {
          email?: string;
          name?: string;
          picture?: string;
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
        throw new ForwardedError(
          `Failed to parse id token and get profile info`,
          e,
        );
      }
    }

    return {
      email,
      picture,
      displayName,
    };
  };

  static async executeRedirectStrategy(
    req: Request,
    providerStrategy: Strategy,
    options: Record<string, string>,
  ): Promise<{
    /**
     * URL to redirect to
     */
    url: string;
    /**
     * Status code to use for the redirect
     */
    status?: number;
  }> {
    return new Promise((resolve, reject) => {
      const strategy = Object.create(providerStrategy);
      strategy.error = (error: Error) => {
        reject(new Error(`Authentication failed, ${error.message ?? ''}`));
      };
      strategy.redirect = (url: string, status?: number) => {
        resolve({ url, status: status ?? undefined });
      };

      strategy.authenticate(req, { ...options });
    });
  }

  static async executeFrameHandlerStrategy<TResult, TPrivateInfo = never>(
    req: Request,
    providerStrategy: Strategy,
    options?: Record<string, string>,
  ): Promise<{ result: TResult; privateInfo: TPrivateInfo }> {
    return new Promise((resolve, reject) => {
      const strategy = Object.create(providerStrategy);
      strategy.success = (result: any, privateInfo: any) => {
        resolve({ result, privateInfo });
      };
      strategy.fail = (
        info: { type: 'success' | 'error'; message?: string },
        // _status: number,
      ) => {
        reject(new Error(`Authentication rejected, ${info.message ?? ''}`));
      };
      strategy.error = (error: InternalOAuthError) => {
        let message = `Authentication failed, ${error.message}`;

        if (error.oauthError?.data) {
          try {
            const errorData = JSON.parse(error.oauthError.data);

            if (errorData.message) {
              message += ` - ${errorData.message}`;
            }
          } catch (parseError) {
            message += ` - ${error.oauthError}`;
          }
        }

        reject(new Error(message));
      };
      strategy.redirect = () => {
        reject(new Error('Unexpected redirect'));
      };
      strategy.authenticate(req, { ...(options ?? {}) });
    });
  }

  static async executeRefreshTokenStrategy(
    providerStrategy: Strategy,
    refreshToken: string,
    scope: string,
  ): Promise<{
    /**
     * An access token issued for the signed in user.
     */
    accessToken: string;
    /**
     * Optionally, the server can issue a new Refresh Token for the user
     */
    refreshToken?: string;
    params: any;
  }> {
    return new Promise((resolve, reject) => {
      const anyStrategy = providerStrategy as any;
      const OAuth2 = anyStrategy._oauth2.constructor;
      const oauth2 = new OAuth2(
        anyStrategy._oauth2._clientId,
        anyStrategy._oauth2._clientSecret,
        anyStrategy._oauth2._baseSite,
        anyStrategy._oauth2._authorizeUrl,
        anyStrategy._refreshURL || anyStrategy._oauth2._accessTokenUrl,
        anyStrategy._oauth2._customHeaders,
      );

      oauth2.getOAuthAccessToken(
        refreshToken,
        {
          scope,
          grant_type: 'refresh_token',
        },
        (
          err: Error | null,
          accessToken: string,
          newRefreshToken: string,
          params: any,
        ) => {
          if (err) {
            reject(new ForwardedError(`Failed to refresh access token`, err));
          }
          if (!accessToken) {
            reject(
              new Error(
                `Failed to refresh access token, no access token received`,
              ),
            );
          }

          resolve({
            accessToken,
            refreshToken: newRefreshToken,
            params,
          });
        },
      );
    });
  }

  static async executeFetchUserProfileStrategy(
    providerStrategy: Strategy,
    accessToken: string,
  ): Promise<PassportProfile> {
    return new Promise((resolve, reject) => {
      const anyStrategy = providerStrategy as unknown as {
        userProfile(accessToken: string, callback: Function): void;
      };
      anyStrategy.userProfile(
        accessToken,
        (error: Error, rawProfile: PassportProfile) => {
          if (error) {
            reject(error);
          } else {
            resolve(rawProfile);
          }
        },
      );
    });
  }
}
