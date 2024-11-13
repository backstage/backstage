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

import { ForwardedError, stringifyError } from '@backstage/errors';
import { readFile } from 'fs/promises';
import ldap, { Client, SearchEntry, SearchOptions } from 'ldapjs';
import { cloneDeep } from 'lodash';
import tlsLib from 'tls';
import { BindConfig, TLSConfig } from './config';
import { createOptions, errorString } from './util';
import {
  AEDirVendor,
  ActiveDirectoryVendor,
  DefaultLdapVendor,
  GoogleLdapVendor,
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

    const client = ldap.createClient({
      url: target,
      tlsOptions: {
        secureContext,
        rejectUnauthorized: tls?.rejectUnauthorized,
      },
    });

    // We want to have a catch-all error handler at the top, since the default
    // behavior of the client is to blow up the entire process when it fails,
    // unless an error handler is set.
    client.on('error', (err: ldap.Error) => {
      logger.warn(`LDAP client threw an error, ${errorString(err)}`);
    });

    if (!bind) {
      return new LdapClient(client, logger);
    }

    return new Promise<LdapClient>((resolve, reject) => {
      const { dn, secret } = bind;
      client.bind(dn, secret, err => {
        if (err) {
          reject(`LDAP bind failed for ${dn}, ${errorString(err)}`);
        } else {
          resolve(new LdapClient(client, logger));
        }
      });
    });
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
  async search(dn: string, options: SearchOptions): Promise<SearchEntry[]> {
    try {
      const output: SearchEntry[] = [];

      const logInterval = setInterval(() => {
        this.logger.debug(`Read ${output.length} LDAP entries so far...`);
      }, 5000);

      const search = new Promise<SearchEntry[]>((resolve, reject) => {
        // Note that we clone the (frozen) options, since ldapjs rudely tries to
        // overwrite parts of them
        this.client.search(dn, cloneDeep(options), (err, res) => {
          if (err) {
            reject(new Error(errorString(err)));
            return;
          }

          res.on('searchReference', () => {
            this.logger.warn('Received unsupported search referral');
          });

          res.on('searchEntry', entry => {
            output.push(entry);
          });

          res.on('error', e => {
            reject(new Error(errorString(e)));
          });

          res.on('page', (_result, cb) => {
            if (cb) {
              cb();
            }
          });

          res.on('end', r => {
            if (!r) {
              reject(new Error('Null response'));
            } else if (r.status !== 0) {
              reject(new Error(`Got status ${r.status}: ${r.errorMessage}`));
            } else {
              resolve(output);
            }
          });
        });
      });

      return await search.finally(() => {
        clearInterval(logInterval);
      });
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
  async searchStreaming(
    dn: string,
    options: SearchOptions,
    f: (entry: SearchEntry) => Promise<void> | void,
  ): Promise<void> {
    try {
      return await new Promise<void>((resolve, reject) => {
        // Note that we clone the (frozen) options, since ldapjs rudely tries to
        // overwrite parts of them
        this.client.search(dn, createOptions(options), (err, res) => {
          if (err) {
            reject(new Error(errorString(err)));
          }
          let awaitList: Array<Promise<void> | void> = [];
          let transformError = false;

          const transformReject = (e: Error) => {
            transformError = true;
            reject(
              new Error(
                `Transform function threw an exception, ${stringifyError(e)}`,
              ),
            );
          };

          res.on('searchReference', () => {
            this.logger.warn('Received unsupported search referral');
          });

          res.on('searchEntry', entry => {
            if (!transformError) awaitList.push(f(entry));
          });

          res.on('page', (_, cb) => {
            // awaits completion before fetching next page
            Promise.all(awaitList)
              .then(() => {
                // flush list
                awaitList = [];
                if (cb) cb();
              })
              .catch(transformReject);
          });

          res.on('error', e => {
            reject(new Error(errorString(e)));
          });

          res.on('end', r => {
            if (!r) {
              throw new Error('Null response');
            } else if (r.status !== 0) {
              throw new Error(`Got status ${r.status}: ${r.errorMessage}`);
            } else {
              Promise.all(awaitList)
                .then(() => resolve())
                .catch(transformReject);
            }
          });
        });
      });
    } catch (e) {
      throw new ForwardedError(`LDAP search at DN "${dn}" failed`, e);
    }
  }

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
    const clientHost = this.client?.host || '';
    this.vendor = this.getRootDSE()
      .then(root => {
        if (root && root.raw?.forestFunctionality) {
          return ActiveDirectoryVendor;
        } else if (root && root.raw?.ipaDomainLevel) {
          return FreeIpaVendor;
        } else if (root && 'aeRoot' in root.raw) {
          return AEDirVendor;
        } else if (clientHost === 'ldap.google.com') {
          return GoogleLdapVendor;
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
  async getRootDSE(): Promise<SearchEntry | undefined> {
    const result = await this.search('', {
      scope: 'base',
      filter: '(objectclass=*)',
    } as SearchOptions);
    if (result && result.length === 1) {
      return result[0];
    }
    return undefined;
  }
}
