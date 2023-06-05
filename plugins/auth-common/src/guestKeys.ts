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

/**
 * Holds the Guest User Identity Private Keys when allowGuestMode flag in Config is set.
 *
 * @remarks
 *
 *  `auth.allowGuestMode` flag: when using this flag, a `GuestUserIdentity` private key is added to the list of valid keys Users can authenticate with in the `DefaultClientAuthProvider`.
 *  Guest Token only provided with the "development" and "test" process mode. Does not work with "production" process mode.
 *
 * @public
 */
export const GUEST_USER_PRIVATE_KEY: string =
  '-----BEGIN PRIVATE KEY-----\n' +
  'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgeK+2+vxWmdH3l5vS\n' +
  'fWPXCPojy2dQ44hr3XoUN3pQ1KihRANCAATtkYfMKdb1cLkasRc87l7+Fu0BfNY3\n' +
  'OMxEttX87GkP3+2Q6IzR1LSa9+h5APS781hKNPFlUQDnutzAuChCaP7Z\n' +
  '-----END PRIVATE KEY-----\n';

/**
 * Holds the Guest User Identity Private Key JWK value used for authentication when allowGuestMode flag in Config is set.
 *
 * @remarks
 *
 *  `auth.allowGuestMode` flag: when using this flag, a `GuestUserIdentity` private key is added to the list of valid keys Users can authenticate with in the `DefaultClientAuthProvider`.
 *  Guest Token only provided with the "development" and "test" process mode. Does not work with "production" process mode.
 * GUEST_KEY_JWK_VALUES values match GUEST_USER_PRIVATE_KEY and are used to validate this static key.
 *
 * @public
 */

export const GUEST_KEY_JWK_VALUES = {
  alg: 'ES256',
  kty: 'EC',
  x: '7ZGHzCnW9XC5GrEXPO5e_hbtAXzWNzjMRLbV_OxpD98',
  y: '7ZDojNHUtJr36HkA9LvzWEo08WVRAOe63MC4KEJo_tk',
  crv: 'P-256',
};
