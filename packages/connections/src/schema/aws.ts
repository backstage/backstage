/*
 * Copyright 2026 The Backstage Authors
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
import { InputError } from '@backstage/errors';
import { createConnectionType } from '../system/createConnectionType';
import { z } from 'zod/v4';

// The account number is the fifth colon-separated segment of an ARN, e.g.
// arn:aws:iam::123456789012:role/my-role. Some ARNs (e.g. S3) leave the
// segment empty, in which case no account can be derived and the main
// account applies. Malformed ARNs are rejected rather than silently
// resolving to the main account's credentials.
function accountIdFromArn(arn: string): string | undefined {
  const parts = arn.split(':');
  if (parts.length < 6 || parts[0] !== 'arn') {
    throw new InputError(`Invalid ARN "${arn}" in connection lookup`);
  }
  return parts[4] || undefined;
}

/**
 * Access to AWS accounts, looked up by account number or ARN rather than by
 * URL. At most one `aws` connection can exist, holding one `account` auth
 * entry per AWS account.
 *
 * The entry marked `mainAccount: true` is the fallback when no entry matches
 * the requested account, and is the source of master credentials for role
 * assumption. `roleName` always means the role to assume in the account being
 * resolved: on an auth entry that is the entry's own account, while the
 * connection-level `roleName` covers any account without an entry of its own.
 *
 * @public
 */
export const AwsConnectionType = createConnectionType({
  type: 'aws',
  title: 'AWS',
  cardinality: 'singleton',
  lookupStrategy: 'aws',
  configSchema: z
    .object({
      roleName: z.string().optional(),
      partition: z.string().optional(),
      region: z.string().optional(),
      externalId: z.string().optional(),
      webIdentityTokenFile: z.string().optional(),
    })
    .refine(v => !(v.partition && !v.roleName), {
      error: 'partition requires a roleName to be provided',
    })
    .refine(v => !(v.region && !v.roleName), {
      error: 'region requires a roleName to be provided',
    })
    .refine(v => !(v.externalId && !v.roleName), {
      error: 'externalId requires a roleName to be provided',
    })
    .refine(v => !(v.webIdentityTokenFile && !v.roleName), {
      error: 'webIdentityTokenFile requires a roleName to be provided',
    })
    .refine(v => !(v.webIdentityTokenFile && v.externalId), {
      error:
        'webIdentityTokenFile and externalId are mutually exclusive; AssumeRoleWithWebIdentity does not support external IDs',
    }),
  authMethods: [
    {
      method: 'account',
      title: 'Account',
      configSchema: z
        .object({
          accountId: z.string().optional(),
          mainAccount: z.boolean().optional(),
          accessKeyId: z.string().optional(),
          secretAccessKey: z.string().optional(),
          profile: z.string().optional(),
          roleName: z.string().optional(),
          partition: z.string().optional(),
          region: z.string().optional(),
          externalId: z.string().optional(),
          webIdentityTokenFile: z.string().optional(),
        })
        .refine(v => v.accountId || v.mainAccount, {
          error: 'accountId is required unless mainAccount is set',
        })
        .refine(v => !(v.mainAccount && v.roleName), {
          error:
            'the mainAccount entry provides the credentials used to assume roles and cannot itself declare a roleName',
        })
        .refine(v => !v.accessKeyId === !v.secretAccessKey, {
          error:
            'accessKeyId and secretAccessKey must be specified together, but only one was provided',
        })
        .refine(v => !(v.profile && v.accessKeyId), {
          error:
            'profile and static credentials are mutually exclusive, but both were provided',
        })
        .refine(v => !(v.profile && v.roleName), {
          error:
            'profile and roleName are mutually exclusive, but both were provided',
        })
        .refine(v => !(v.externalId && !v.roleName), {
          error: 'externalId requires a roleName to be provided',
        })
        .refine(v => !(v.region && !v.roleName && !v.mainAccount), {
          error: 'region requires a roleName to be provided',
        })
        .refine(v => !(v.partition && !v.roleName), {
          error: 'partition requires a roleName to be provided',
        })
        .refine(v => !(v.webIdentityTokenFile && !v.roleName), {
          error: 'webIdentityTokenFile requires a roleName to be provided',
        })
        .refine(v => !(v.webIdentityTokenFile && v.accessKeyId), {
          error:
            'webIdentityTokenFile and static credentials are mutually exclusive, but both were provided',
        })
        .refine(v => !(v.webIdentityTokenFile && v.profile), {
          error:
            'webIdentityTokenFile and profile are mutually exclusive, but both were provided',
        })
        .refine(v => !(v.webIdentityTokenFile && v.externalId), {
          error:
            'webIdentityTokenFile and externalId are mutually exclusive; AssumeRoleWithWebIdentity does not support external IDs',
        }),
    },
  ],
  matchAuth: (authMethods, query) => {
    const accountId =
      query.accountId ?? (query.arn ? accountIdFromArn(query.arn) : undefined);

    if (accountId) {
      const account = authMethods.find(a => a.accountId === accountId);
      if (account) {
        return account;
      }
    }

    return authMethods.find(a => a.mainAccount);
  },
  validate: ({ config, auth }) => {
    const seen = new Set<string>();
    for (const entry of auth) {
      if (entry.accountId) {
        if (seen.has(entry.accountId)) {
          throw new InputError(
            `Multiple auth entries for AWS account "${entry.accountId}", but only one is allowed`,
          );
        }
        seen.add(entry.accountId);
      }
    }

    const mainAccounts = auth.filter(a => a.mainAccount);
    if (mainAccounts.length > 1) {
      throw new InputError(
        'Multiple auth entries are marked as mainAccount, but only one is allowed',
      );
    }
    if (config.roleName && mainAccounts.length === 0) {
      throw new InputError(
        'A connection-level roleName requires an auth entry marked as mainAccount to provide the credentials for assuming it',
      );
    }
  },
});
