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

import { ForwardedError } from '@backstage/errors';
import { readFile } from 'fs/promises';
import { Client, Entry, SearchOptions, SearchResult } from 'ldapts';
import tlsLib from 'tls';
import { BindConfig, TLSConfig } from './config';
import { errorString } from './util';
import {
  AEDirVendor,
  ActiveDirectoryVendor,
  DefaultLdapVendor,
  //   GoogleLdapVendor,
  LLDAPVendor,
  FreeIpaVendor,
  LdapVendor,
} from './vendors';
import { LoggerService } from '@backstage/backend-plugin-api';

/**
 * Basic wrapper for the `ldapjs` library.
 *
 * Helps out with promisifying calls, paging, binding etc.
 *
 * @public
 */

export class LdapClient {
  private vendor: Promise<LdapVendor> | undefined;

  static async create(
    logger: LoggerService,
    target: string,
    bind?: BindConfig,
    tls?: TLSConfig,
  ): Promise<LdapClient> {
    let secureContext;
    if (tls && tls.certs && tls.keys) {
      const cert = await readFile(tls.certs, 'utf-8');
      const key = await readFile(tls.keys, 'utf-8');
      secureContext = tlsLib.createSecureContext({
        cert: cert,
        key: key,
      });
    }

    const client = new Client({
      url: target,
      tlsOptions: {
        secureContext,
        rejectUnauthorized: tls?.rejectUnauthorized,
      },
    });

    const ldapClient = new LdapClient(client, logger);

    if (bind) {
      try {
        await client.bind(bind.dn, bind.secret);
      } catch (error) {
        await client.unbind();
        throw error(`LDAP bind failed for ${bind.dn}, ${errorString(error)}`);
      }
    }
    return ldapClient;
  }
  constructor(
    private readonly client: Client,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Performs an LDAP search operation.
   *
   * @param dn - The fully qualified base DN to search within
   * @param options - The search options
   */
  async search(dn: string, options: SearchOptions): Promise<SearchResult> {
    this.logger.debug(`Reading LDAP entries so far`);
    try {
      const ldaptsOptions: SearchOptions = {
        scope: options.scope,
        filter: options.filter,
        attributes: options.attributes,
        sizeLimit: options.sizeLimit,
        timeLimit: options.timeLimit,
        derefAliases: options.derefAliases,
        paged: options.paged,
      };

      const result = await this.client.search(dn, ldaptsOptions);

      return result;
    } catch (e) {
      throw new ForwardedError(`LDAP search at DN "${dn}" failed`, e);
    }
  }

  /**
   * Performs an LDAP search operation, calls a function on each entry to limit memory usage
   *
   * @param dn - The fully qualified base DN to search within
   * @param options - The search options
   * @param f - The callback to call on each search entry
   */
  // async searchStreaming(
  //   dn: string,
  //   options: SearchOptions,
  //   f: (entry: SearchEntry) => Promise<void> | void,
  // ): Promise<void> {
  //   try {
  //     return await new Promise<void>((resolve, reject) => {
  //       // Note that we clone the (frozen) options, since ldapjs rudely tries to
  //       // overwrite parts of them
  //       this.client.search(dn, createOptions(options), (err, res) => {
  //         if (err) {
  //           reject(new Error(errorString(err)));
  //         }
  //         let awaitList: Array<Promise<void> | void> = [];
  //         let transformError = false;

  //         const transformReject = (e: Error) => {
  //           transformError = true;
  //           reject(
  //             new Error(
  //               `Transform function threw an exception, ${stringifyError(e)}`,
  //             ),
  //           );
  //         };

  //         res.on('searchReference', () => {
  //           this.logger.warn('Received unsupported search referral');
  //         });

  //         res.on('searchEntry', entry => {
  //           if (!transformError) awaitList.push(f(entry));
  //         });

  //         res.on('page', (_, cb) => {
  //           // awaits completion before fetching next page
  //           Promise.all(awaitList)
  //             .then(() => {
  //               // flush list
  //               awaitList = [];
  //               if (cb) cb();
  //             })
  //             .catch(transformReject);
  //         });

  //         res.on('error', e => {
  //           reject(new Error(errorString(e)));
  //         });

  //         res.on('end', r => {
  //           if (!r) {
  //             throw new Error('Null response');
  //           } else if (r.status !== 0) {
  //             throw new Error(`Got status ${r.status}: ${r.errorMessage}`);
  //           } else {
  //             Promise.all(awaitList)
  //               .then(() => resolve())
  //               .catch(transformReject);
  //           }
  //         });
  //       });
  //     });
  //   } catch (e) {
  //     throw new ForwardedError(`LDAP search at DN "${dn}" failed`, e);
  //   }
  // }

  /**
   * Get the Server Vendor.
   * Currently only detects Microsoft Active Directory Servers.
   *
   * @see https://ldapwiki.com/wiki/Determine%20LDAP%20Server%20Vendor
   */
  async getVendor(): Promise<LdapVendor> {
    if (this.vendor) {
      return this.vendor;
    }
    // const clientHost = this.client?.host || '';
    this.vendor = this.getRootDSE()
      .then(root => {
        if (root && root.forestFunctionality) {
          return ActiveDirectoryVendor;
        } else if (root && root.ipaDomainLevel) {
          return FreeIpaVendor;
        } else if (root && 'aeRoot' in root) {
          return AEDirVendor;
          // } else if (clientHost === 'ldap.google.com') {
          //   return GoogleLdapVendor;
        } else if (root && root.vendorName?.toString() === 'LLDAP') {
          return LLDAPVendor;
        }
        return DefaultLdapVendor;
      })
      .catch(err => {
        this.vendor = undefined;
        throw err;
      });
    return this.vendor;
  }

  /**
   * Get the Root DSE.
   *
   * @see https://ldapwiki.com/wiki/RootDSE
   */
  async getRootDSE(): Promise<Entry | undefined> {
    const result = await this.client.search('', {
      scope: 'base',
      filter: '(objectclass=*)',
    } as SearchOptions);
    if (result && result.searchEntries.length === 1) {
      return result.searchEntries[0];
    }
    return undefined;
  }
}
