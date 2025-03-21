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

export { LdapClient } from './client';
export { mapStringAttr } from './util';
export { readProviderConfigs, readLdapLegacyConfig } from './config';
export type {
  LdapProviderConfig,
  GroupConfig,
  UserConfig,
  BindConfig,
  TLSConfig,
  VendorConfig,
} from './config';
export type { LdapVendor } from './vendors';
export {
  LDAP_DN_ANNOTATION,
  LDAP_RDN_ANNOTATION,
  LDAP_UUID_ANNOTATION,
} from './constants';
export {
  defaultGroupTransformer,
  defaultUserTransformer,
  readLdapOrg,
} from './read';
export type { GroupTransformer, UserTransformer } from './types';
