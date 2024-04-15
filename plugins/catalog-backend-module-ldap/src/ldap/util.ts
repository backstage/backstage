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

import { Error as LDAPError, SearchEntry, SearchOptions } from 'ldapjs';
import { cloneDeep } from 'lodash';
import { LdapVendor } from './vendors';

/**
 * Builds a string form of an LDAP Error structure.
 *
 * @param error - The error
 */
export function errorString(error: LDAPError) {
  return `${error.code} ${error.name}: ${error.message}`;
}

/**
 * Maps a single-valued attribute to a consumer.
 *
 * This helper can be useful when implementing a user or group transformer.
 *
 * @param entry - The LDAP source entry
 * @param vendor - The LDAP vendor
 * @param attributeName - The source attribute to map. If the attribute is
 *        undefined the mapping will be silently ignored.
 * @param setter - The function to be called with the decoded attribute from the
 *        source entry
 *
 * @public
 */
export function mapStringAttr(
  entry: SearchEntry,
  vendor: LdapVendor,
  attributeName: string | undefined,
  setter: (value: string) => void,
) {
  if (attributeName) {
    const values = vendor.decodeStringAttribute(entry, attributeName);
    if (values && values.length === 1) {
      setter(values[0]);
    }
  }
}

export function createOptions(inputOptions: SearchOptions): SearchOptions {
  const result = cloneDeep(inputOptions);

  if (result.paged === true) {
    result.paged = { pagePause: true };
  } else if (typeof result.paged === 'object') {
    result.paged.pagePause = true;
  }

  return result;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
      ? RecursivePartial<T[P]>
      : T[P];
};
