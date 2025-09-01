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
import {
  AEDirVendor,
  ActiveDirectoryVendor,
  DefaultLdapVendor,
  LLDAPVendor,
  FreeIpaVendor,
  LdapVendor,
  GoogleLdapVendor,
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
    const tlsOptions: tlsLib.ConnectionOptions = {
      secureContext,
      rejectUnauthorized: tls?.rejectUnauthorized,
    };
    const client = new Client({
      url: target,
      ...(Object.values(tlsOptions).some(v => v !== undefined)
        ? { tlsOptions }
        : undefined),
    });

    const ldapClient = new LdapClient(client, logger);

    if (bind) {
      try {
        await client.bind(bind.dn, bind.secret);
      } catch (error) {
        await client.unbind();
        throw new ForwardedError(
          `LDAP bind failed for ${bind.dn}, ${error}`,
          error,
        );
      }
    }
    return ldapClient;
  }

  private readonly client: Client;
  private readonly logger: LoggerService;

  constructor(client: Client, logger: LoggerService) {
    this.client = client;
    this.logger = logger;
  }

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
        } else if (this.isGoogleLDAP(root)) {
          return GoogleLdapVendor;
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
   * Check if the LDAP server is Google LDAP by examining RootDSE and schema
   */
  private isGoogleLDAP(rootDSE: Entry | undefined): boolean {
    if (!rootDSE) {
      return false;
    }

    // RootDSE characteristics
    const hasGoogleRootDSEPattern =
      !rootDSE.namingContexts && // No namingContexts
      !rootDSE.supportedControl && // No supportedControl
      !rootDSE.vendorName && // No vendor info
      !rootDSE.vendorVersion &&
      rootDSE.subschemaSubentry === 'cn=subschema';

    if (!hasGoogleRootDSEPattern) {
      return false;
    }

    try {
      const schemaHasGoogleAttributes = this.checkGoogleSchema(rootDSE);
      return schemaHasGoogleAttributes;
    } catch (error) {
      throw new ForwardedError('Schema check failed', error);
    }
  }

  // Check a shema for Google-specific patterns
  private checkGoogleSchema(rootDSE: Entry): boolean {
    try {
      const objectClasses = this.parseSchemaValues(rootDSE.objectClasses);
      const attributeTypes = this.parseSchemaValues(rootDSE.attributeTypes);

      // Check if any Google-specific attributes are present
      const hasGoogleAttributes =
        objectClasses.some(oc => oc.includes('googleUid')) ||
        attributeTypes.some(at => at.includes('googleAdminCreated'));

      return hasGoogleAttributes;
    } catch (error) {
      this.logger.warn('Error checking schema:', error);
      return false;
    }
  }

  private parseSchemaValues(
    schemaValue: Buffer | Buffer[] | string[] | string,
  ): string[] {
    if (!schemaValue) return [];

    const values = Array.isArray(schemaValue) ? schemaValue : [schemaValue];
    return values.map(v => v.toString());
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
