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
import { AwsConnectionType } from './aws';

const account = (accountId: string) => ({
  method: 'account' as const,
  title: 'Account',
  accountId,
  roleName: 'my-role',
});

const mainAccount = {
  method: 'account' as const,
  title: 'Main Account',
  mainAccount: true,
};

describe('AwsConnectionType', () => {
  describe('matchAuth', () => {
    it('selects the account matching the account ID', () => {
      const first = account('111111111111');
      const second = account('222222222222');

      expect(
        AwsConnectionType.matchAuth?.([first, mainAccount, second], {
          accountId: '222222222222',
        }),
      ).toBe(second);
    });

    it('selects the account matching the ARN account number', () => {
      const first = account('111111111111');
      const second = account('222222222222');

      expect(
        AwsConnectionType.matchAuth?.([first, second], {
          arn: 'arn:aws:iam::111111111111:role/some-role',
        }),
      ).toBe(first);
    });

    it('falls back to the main account when no account matches', () => {
      const first = account('111111111111');

      expect(
        AwsConnectionType.matchAuth?.([first, mainAccount], {
          accountId: '999999999999',
        }),
      ).toBe(mainAccount);
      expect(AwsConnectionType.matchAuth?.([first, mainAccount], {})).toBe(
        mainAccount,
      );
      expect(
        AwsConnectionType.matchAuth?.([first, mainAccount], {
          arn: 'arn:aws:s3:::my-bucket',
        }),
      ).toBe(mainAccount);
    });

    it('matches the main account directly when it declares an account ID', () => {
      const main = { ...mainAccount, accountId: '333333333333' };

      expect(
        AwsConnectionType.matchAuth?.([account('111111111111'), main], {
          accountId: '333333333333',
        }),
      ).toBe(main);
    });

    it('rejects malformed ARNs instead of falling back', () => {
      expect(() =>
        AwsConnectionType.matchAuth?.([mainAccount], {
          arn: 'not-an-arn',
        }),
      ).toThrow(/Invalid ARN "not-an-arn"/);
    });

    it('returns undefined when nothing matches and there is no main account', () => {
      expect(
        AwsConnectionType.matchAuth?.([account('111111111111')], {
          accountId: '999999999999',
        }),
      ).toBeUndefined();
    });
  });

  describe('auth method schema', () => {
    const accountSchema = AwsConnectionType.authMethods[0].configSchema;

    it('accepts valid account credential combinations', () => {
      expect(() =>
        accountSchema.parse({
          accountId: '111111111111',
          accessKeyId: 'key',
          secretAccessKey: 'secret',
        }),
      ).not.toThrow();
      expect(() =>
        accountSchema.parse({
          accountId: '111111111111',
          roleName: 'my-role',
          externalId: 'external-id',
          region: 'eu-west-1',
          partition: 'aws',
        }),
      ).not.toThrow();
      expect(() =>
        accountSchema.parse({
          accountId: '111111111111',
          roleName: 'my-role',
          webIdentityTokenFile: '/token',
        }),
      ).not.toThrow();
      expect(() =>
        accountSchema.parse({ accountId: '111111111111', profile: 'default' }),
      ).not.toThrow();
    });

    it('rejects invalid account credential combinations', () => {
      const base = { accountId: '111111111111' };
      expect(() => accountSchema.parse({})).toThrow(
        /Invalid configuration for auth method "account"/,
      );
      expect(() =>
        accountSchema.parse({ ...base, accessKeyId: 'key' }),
      ).toThrow(/Invalid configuration for auth method "account"/);
      expect(() =>
        accountSchema.parse({ ...base, secretAccessKey: 'secret' }),
      ).toThrow();
      expect(() =>
        accountSchema.parse({
          ...base,
          profile: 'default',
          accessKeyId: 'key',
          secretAccessKey: 'secret',
        }),
      ).toThrow();
      expect(() =>
        accountSchema.parse({ ...base, profile: 'default', roleName: 'role' }),
      ).toThrow();
      expect(() =>
        accountSchema.parse({ ...base, externalId: 'external-id' }),
      ).toThrow();
      expect(() =>
        accountSchema.parse({ ...base, region: 'eu-west-1' }),
      ).toThrow();
      expect(() =>
        accountSchema.parse({ ...base, partition: 'aws' }),
      ).toThrow();
      expect(() =>
        accountSchema.parse({ ...base, webIdentityTokenFile: '/token' }),
      ).toThrow();
      expect(() =>
        accountSchema.parse({
          ...base,
          roleName: 'role',
          webIdentityTokenFile: '/token',
          externalId: 'external-id',
        }),
      ).toThrow();
    });

    it('validates main account entries', () => {
      expect(() => accountSchema.parse({ mainAccount: true })).not.toThrow();
      expect(() =>
        accountSchema.parse({
          mainAccount: true,
          accessKeyId: 'key',
          secretAccessKey: 'secret',
          region: 'eu-west-1',
        }),
      ).not.toThrow();
      expect(() =>
        accountSchema.parse({
          mainAccount: true,
          accountId: '111111111111',
          profile: 'main',
        }),
      ).not.toThrow();

      // The main account is the source of master credentials for role
      // assumption, so it cannot itself declare role assumption fields.
      expect(() =>
        accountSchema.parse({ mainAccount: true, roleName: 'role' }),
      ).toThrow(/Invalid configuration for auth method "account"/);
      expect(() =>
        accountSchema.parse({ mainAccount: true, accessKeyId: 'key' }),
      ).toThrow();
      expect(() =>
        accountSchema.parse({
          mainAccount: true,
          profile: 'main',
          accessKeyId: 'key',
          secretAccessKey: 'secret',
        }),
      ).toThrow();
    });
  });

  describe('connection config schema', () => {
    const configSchema = AwsConnectionType.configSchema;

    it('accepts valid wildcard role configurations', () => {
      expect(() => configSchema.parse({})).not.toThrow();
      expect(() =>
        configSchema.parse({ roleName: 'backstage-role' }),
      ).not.toThrow();
      expect(() =>
        configSchema.parse({
          roleName: 'backstage-role',
          partition: 'aws',
          region: 'eu-west-1',
          externalId: 'external-id',
        }),
      ).not.toThrow();
      expect(() =>
        configSchema.parse({
          roleName: 'backstage-role',
          webIdentityTokenFile: '/token',
        }),
      ).not.toThrow();
    });

    it('rejects wildcard role fields without a roleName', () => {
      expect(() => configSchema.parse({ partition: 'aws' })).toThrow(
        /Invalid configuration for connection type "aws"/,
      );
      expect(() => configSchema.parse({ region: 'eu-west-1' })).toThrow();
      expect(() => configSchema.parse({ externalId: 'external-id' })).toThrow();
      expect(() =>
        configSchema.parse({ webIdentityTokenFile: '/token' }),
      ).toThrow();
      expect(() =>
        configSchema.parse({
          roleName: 'backstage-role',
          webIdentityTokenFile: '/token',
          externalId: 'external-id',
        }),
      ).toThrow();
    });
  });

  describe('validate', () => {
    it('rejects duplicate account IDs across entries', () => {
      expect(() =>
        AwsConnectionType.validate?.({
          config: {},
          auth: [
            { method: 'account', accountId: '111111111111' },
            { method: 'account', accountId: '222222222222' },
            { method: 'account', accountId: '111111111111', profile: 'other' },
          ],
        }),
      ).toThrow(/Multiple auth entries for AWS account "111111111111"/);
    });

    it('rejects multiple main account entries', () => {
      expect(() =>
        AwsConnectionType.validate?.({
          config: {},
          auth: [
            { method: 'account', mainAccount: true },
            { method: 'account', mainAccount: true, profile: 'other' },
          ],
        }),
      ).toThrow(/Multiple auth entries are marked as mainAccount/);
    });

    it('requires a main account entry for the connection-level roleName', () => {
      expect(() =>
        AwsConnectionType.validate?.({
          config: { roleName: 'backstage-role' },
          auth: [{ method: 'account', accountId: '111111111111' }],
        }),
      ).toThrow(/requires an auth entry marked as mainAccount/);
    });

    it('accepts a valid combination of entries', () => {
      expect(() =>
        AwsConnectionType.validate?.({
          config: { roleName: 'backstage-role' },
          auth: [
            { method: 'account', accountId: '111111111111' },
            { method: 'account', mainAccount: true, profile: 'main' },
          ],
        }),
      ).not.toThrow();
    });
  });

  it('emits JSON schemas despite the refinements', () => {
    expect(
      AwsConnectionType.authMethods[0].configSchema.schema().schema,
    ).toMatchObject({
      type: 'object',
      properties: { accountId: { type: 'string' } },
    });
    expect(AwsConnectionType.configSchema.schema().schema).toMatchObject({
      type: 'object',
      properties: { roleName: { type: 'string' } },
    });
  });
});
