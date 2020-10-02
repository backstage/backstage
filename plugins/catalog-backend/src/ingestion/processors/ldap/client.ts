/*
 * Copyright 2020 Spotify AB
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

import ldap, { Client, SearchEntry, SearchOptions } from 'ldapjs';
import { BindConfig } from './config';
import { errorString } from './util';

/**
 * Basic wrapper for the ldapjs library.
 *
 * Helps out with promisifying calls, paging, binding etc.
 */
export class LdapClient {
  static create(target: string, bind?: BindConfig): Promise<LdapClient> {
    return new Promise<LdapClient>((resolve, reject) => {
      const client = ldap.createClient({ url: target });
      if (!bind) {
        resolve(new LdapClient(client));
        return;
      }

      const { dn, secret } = bind;
      client.bind(dn, secret, err => {
        if (err) {
          reject(`LDAP bind failed for ${dn}, ${errorString(err)}`);
        } else {
          resolve(new LdapClient(client));
        }
      });
    });
  }

  constructor(private readonly client: Client) {}

  /**
   * Performs an LDAP search operation.
   *
   * @param dn The fully qualified base DN to search within
   * @param options The search options
   */
  async search(dn: string, options: SearchOptions): Promise<SearchEntry[]> {
    try {
      return await new Promise<SearchEntry[]>((resolve, reject) => {
        const output: SearchEntry[] = [];

        this.client.search(dn, options, (err, res) => {
          if (err) {
            reject(errorString(err));
            return;
          }

          res.on('searchReference', () => {
            reject('Unable to handle referral');
          });

          res.on('searchEntry', entry => {
            output.push(entry);
          });

          res.on('error', e => {
            reject(errorString(e));
          });

          res.on('end', r => {
            if (!r) {
              reject('Null response');
            } else if (r.status !== 0) {
              reject(`Got status ${r.status}: ${r.errorMessage}`);
            } else {
              resolve(output);
            }
          });
        });
      });
    } catch (e) {
      throw new Error(`LDAP search at ${dn} failed, ${e}`);
    }
  }
}
