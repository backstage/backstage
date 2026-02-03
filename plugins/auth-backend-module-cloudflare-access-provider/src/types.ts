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

// JWT Web Token definitions are in the URL below
// https://developers.cloudflare.com/cloudflare-one/identity/users/validating-json/
export const CF_JWT_HEADER = 'cf-access-jwt-assertion';
export const CF_AUTH_IDENTITY = 'cf-access-authenticated-user-email';
export const COOKIE_AUTH_NAME = 'CF_Authorization';
export const CACHE_PREFIX = 'providers/cloudflare-access/profile-v1';

export type ServiceToken = {
  token: string;
  subject: string;
};

/**
 * Can be used in externally provided auth handler or sign in resolver to
 * enrich user profile for sign-in user entity
 *
 * @public
 */
export type CloudflareAccessClaims = {
  /**
   * `aud` identifies the application to which the JWT is issued.
   */
  aud: string[];
  /**
   * `email` contains the email address of the authenticated user.
   */
  email: string;
  /**
   * iat and exp are the issuance and expiration timestamps.
   */
  exp: number;
  iat: number;
  /**
   * `nonce` is the session identifier.
   */
  nonce: string;
  /**
   * `identity_nonce` is available in the Application Token and can be used to
   * query all group membership for a given user.
   */
  identity_nonce: string;
  /**
   * `sub` contains the identifier of the authenticated user.
   */
  sub: string;
  /**
   * `iss` the issuer is the application’s Cloudflare Access Domain URL.
   */
  iss: string;
  /**
   * `custom` contains SAML attributes in the Application Token specified by an
   * administrator in the identity provider configuration.
   */
  custom: string;
};

/**
 * @public
 */
export type CloudflareAccessGroup = {
  /**
   * Group id
   */
  id: string;
  /**
   * Name of group as defined in Cloudflare zero trust dashboard
   */
  name: string;
  /**
   * Access group email address
   */
  email: string;
};

/**
 * @public
 */
export type CloudflareAccessIdentityProfile = {
  id: string;
  name: string;
  email: string;
  groups: CloudflareAccessGroup[];
};

/**
 * @public
 */
export type CloudflareAccessResult = {
  claims: CloudflareAccessClaims;
  cfIdentity: CloudflareAccessIdentityProfile;
  expiresInSeconds?: number;
  token: string;
};
