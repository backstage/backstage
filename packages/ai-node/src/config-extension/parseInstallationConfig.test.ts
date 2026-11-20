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

import { ConfigReader } from '@backstage/config';
import type { AnyModel } from '@earendil-works/pi-ai';

import { parseAiInstallationConfig } from './parseInstallationConfig';
import type { AiInstallationConfig } from './types';

const KEY_BASE64 = Buffer.alloc(32, 7).toString('base64');

function parse(config: unknown, path = 'ai'): AiInstallationConfig {
  return parseAiInstallationConfig({
    root: new ConfigReader(config as never),
    path,
  });
}

function modelEntry(overrides: Record<string, unknown> = {}) {
  return {
    provider: 'openai',
    modelId: 'gpt-5',
    api: 'openai-responses',
    baseUrl: 'https://api.openai.com/v1',
    contextWindow: 400_000,
    maxTokens: 128_000,
    ...overrides,
  };
}

function credentialsSection(overrides: Record<string, unknown> = {}) {
  return {
    encryptionKey: KEY_BASE64,
    scopes: {
      org: { openai: { type: 'api_key', key: 'sk-org' } },
    },
    ...overrides,
  };
}

describe('parseAiInstallationConfig', () => {
  it('keeps the fail-closed default when no installation config exists', () => {
    expect(parse({})).toEqual({ models: [] });
    expect(parse({ assistant: { mode: 'service' } })).toEqual({ models: [] });
  });

  it('parses canonical catalog entries with documented defaults', () => {
    const { models } = parse({ ai: { models: [modelEntry()] } });
    expect(models).toHaveLength(1);
    expect(models[0]).toEqual({
      type: 'chat',
      id: 'gpt-5',
      name: 'gpt-5',
      provider: 'openai',
      api: 'openai-responses',
      baseUrl: 'https://api.openai.com/v1',
      contextWindow: 400_000,
      maxTokens: 128_000,
      reasoning: false,
      input: ['text'],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    });
  });

  it('keeps every explicit catalog field', () => {
    const { models } = parse({
      ai: {
        models: [
          modelEntry({
            name: 'GPT-5',
            reasoning: true,
            input: ['text', 'image'],
            cost: { input: 1.25, output: 10, cacheRead: 0.125 },
          }),
        ],
      },
    });
    const entry = models[0] as AnyModel & { name: string };
    expect(entry.name).toBe('GPT-5');
    expect((entry as unknown as { reasoning: boolean }).reasoning).toBe(true);
    expect(entry.input).toEqual(['text', 'image']);
    expect(entry.cost).toEqual({
      input: 1.25,
      output: 10,
      cacheRead: 0.125,
      cacheWrite: 0,
    });
  });

  it('rejects unknown fields, bad entries and duplicate models', () => {
    const cases: Array<[unknown, RegExp]> = [
      [{ ai: { credential: {} } }, /'credential' is not part of/],
      [{ ai: { models: [modelEntry({ endpoint: 'x' })] } }, /not part of/],
      [{ ai: { models: [modelEntry({ modelId: undefined })] } }, /modelId/],
      [{ ai: { models: [modelEntry({ provider: ' ' })] } }, /provider/],
      [
        {
          ai: {
            models: [modelEntry({ provider: 'mcp:server' })],
          },
        },
        /reserved for MCP tool server credentials/,
      ],
      [
        { ai: { models: [modelEntry({ api: 'OpenAI Responses' })] } },
        /adapter identifier/,
      ],
      [
        { ai: { models: [modelEntry({ baseUrl: 'ftp://x' })] } },
        /http or https/,
      ],
      [
        { ai: { models: [modelEntry({ baseUrl: 'not a url' })] } },
        /http or https/,
      ],
      [{ ai: { models: [modelEntry({ contextWindow: 0 })] } }, /contextWindow/],
      [{ ai: { models: [modelEntry({ maxTokens: 1.5 })] } }, /maxTokens/],
      [{ ai: { models: [modelEntry({ input: ['audio'] })] } }, /input/],
      [{ ai: { models: [modelEntry({ input: [] })] } }, /input/],
      [{ ai: { models: [modelEntry({ cost: { audio: 1 } })] } }, /not part of/],
      [{ ai: { models: [modelEntry({ cost: { input: -1 } })] } }, /cost/],
      [
        { ai: { models: [modelEntry({ reasoning: 'sometimes' })] } },
        /reasoning/,
      ],
      [{ ai: { models: [] } }, /catalog is empty/],
      [
        { ai: { models: [modelEntry(), modelEntry({ name: 'dup' })] } },
        /configured more than once/,
      ],
    ];
    for (const [config, expected] of cases) {
      expect(() => parse(config)).toThrow(expected);
    }
    // Errors name the exact path and field.
    expect(() =>
      parse({ ai: { models: [modelEntry({ api: 'Nope' })] } }),
    ).toThrow(/at 'ai\.models\[0\]'.*'api'/s);
  });

  it('validates key material without echoing it', () => {
    const short = Buffer.alloc(16, 3).toString('base64');
    expect(() =>
      parse({
        ai: { credentials: credentialsSection({ encryptionKey: short }) },
      }),
    ).toThrow(/decodes to 16/);
    expect(() =>
      parse({
        ai: {
          credentials: credentialsSection({ encryptionKey: 'not base64!' }),
        },
      }),
    ).toThrow(/not canonical base64/);
    // The config reader itself rejects an empty string; the error still names
    // the exact path and field.
    expect(() =>
      parse({ ai: { credentials: credentialsSection({ encryptionKey: '' }) } }),
    ).toThrow(/ai\.credentials\.encryptionKey/);
    expect(() => parse({ ai: { credentials: { scopes: {} } } })).toThrow(
      /'encryptionKey' is missing/,
    );
    // The key itself never appears in an error message.
    const keyError = (() => {
      try {
        parse({
          ai: { credentials: credentialsSection({ encryptionKey: short }) },
        });
        return undefined;
      } catch (error) {
        return String(error);
      }
    })();
    expect(keyError).toMatch(/decodes to 16/);
    expect(keyError).not.toContain(short);
  });

  it('validates the previous encryption key without exposing its value', () => {
    const previous = Buffer.alloc(32, 8).toString('base64');
    const parsed = parse({
      ai: {
        credentials: credentialsSection({
          rotation: { previousEncryptionKey: previous },
        }),
      },
    });
    expect(parsed.credentials?.previousEncryptionKey).toEqual(
      new Uint8Array(32).fill(8),
    );
    expect(
      parse({ ai: { credentials: credentialsSection() } }).credentials
        ?.previousEncryptionKey,
    ).toBeUndefined();
    for (const rotation of [
      {},
      { previousEncryptionKey: 'not-secret!!' },
      { previousEncryptionKey: Buffer.alloc(16, 3).toString('base64') },
      { previousEncryptionKey: previous, extra: true },
    ]) {
      expect(() =>
        parse({ ai: { credentials: credentialsSection({ rotation }) } }),
      ).toThrow(/rotation|previousEncryptionKey/);
    }
    const message = (() => {
      try {
        parse({
          ai: {
            credentials: credentialsSection({
              rotation: { previousEncryptionKey: 'secret-value!!' },
            }),
          },
        });
      } catch (error) {
        return String(error);
      }
      return '';
    })();
    expect(message).toContain('previousEncryptionKey');
    expect(message).not.toContain('secret-value!!');
  });

  it('defaults credential precedence to user-first and rejects unknown values', () => {
    expect(
      parse({ ai: { credentials: credentialsSection() } }).credentials
        ?.precedence,
    ).toBe('user-first');
    expect(
      parse({
        ai: { credentials: credentialsSection({ precedence: 'org-first' }) },
      }).credentials?.precedence,
    ).toBe('org-first');
    expect(() =>
      parse({
        ai: {
          credentials: credentialsSection({ precedence: 'service-first' }),
        },
      }),
    ).toThrow(/precedence.*user-first/s);
  });

  it('accepts only org and service credential scopes', () => {
    const parsed = parse({
      ai: {
        credentials: credentialsSection({
          scopes: {
            org: { openai: { type: 'api_key', key: 'sk-org' } },
            'service:catalog-indexer': {
              anthropic: {
                type: 'oauth',
                refresh: 'r',
                access: 'a',
                expires: 1,
              },
            },
          },
        }),
      },
    });
    expect([...parsed.credentials!.scopes.keys()]).toEqual([
      'org',
      'service:catalog-indexer',
    ]);
    expect(parsed.credentials!.scopes.get('org')?.get('openai')).toEqual({
      type: 'api_key',
      key: 'sk-org',
    });

    expect(() =>
      parse({
        ai: {
          credentials: credentialsSection({
            scopes: { 'user:default/alice': { openai: { type: 'api_key' } } },
          }),
        },
      }),
    ).toThrow(
      /personal credentials are never supplied through installation config/,
    );
    // Scope keys are matched exactly: a near miss must not slip through to a
    // store constructor, and the error must name the actual problem.
    for (const scopeKey of ['Service:x', 'org:extra', 'org:x', 'service']) {
      expect(() =>
        parse({
          ai: {
            credentials: credentialsSection({ scopes: { [scopeKey]: {} } }),
          },
        }),
      ).toThrow(
        new RegExp(
          `the scope '${scopeKey}' is not supported\\. Use exactly 'org', or 'service:<plugin-id>'`,
        ),
      );
    }
    expect(() =>
      parse({
        ai: {
          credentials: credentialsSection({ scopes: { 'service:': {} } }),
        },
      }),
    ).toThrow(/service scope id/);
    expect(() =>
      parse({
        ai: {
          credentials: credentialsSection({ scopes: { org: { '': {} } } }),
        },
      }),
    ).toThrow(/provider ID/);
  });

  it('accepts only reserved, secret-free token endpoints keyed by provider', () => {
    const entry = (url: string, clientId = 'public-client-id') => ({
      url,
      clientId,
    });
    const parsed = parse({
      ai: {
        credentials: credentialsSection({
          tokenEndpoints: {
            anthropic: entry('https://api.anthropic.com/v1/oauth/token'),
            openai: entry('https://auth.openai.com/oauth/token', 'openai-id'),
            'openai-azure': entry('https://azure.example/oauth/token'),
          },
        }),
      },
    });
    // Two providers may share a token route: the map is keyed by provider, and
    // each entry carries its family's public client ID beside the URL.
    expect(parsed.credentials!.tokenEndpoints).toEqual({
      anthropic: {
        url: 'https://api.anthropic.com/v1/oauth/token',
        clientId: 'public-client-id',
      },
      openai: {
        url: 'https://auth.openai.com/oauth/token',
        clientId: 'openai-id',
      },
      'openai-azure': {
        url: 'https://azure.example/oauth/token',
        clientId: 'public-client-id',
      },
    });

    // Omitted means no guarded auth operations.
    expect(
      parse({ ai: { credentials: credentialsSection() } }).credentials!
        .tokenEndpoints,
    ).toEqual({});

    const invalid: Array<[unknown, RegExp]> = [
      [{}, /at least one provider endpoint/],
      [
        { anthropic: entry('https://api.anthropic.com/oauth/token?tenant=1') },
        /without query/,
      ],
      [
        { anthropic: entry('https://api.anthropic.com/authorize') },
        /reserved token route/,
      ],
      [
        { anthropic: entry('http://api.anthropic.com/v1/oauth/token') },
        /absolute https/,
      ],
      [
        { anthropic: entry('https://user:pass@api.anthropic.com/oauth/token') },
        /without query/,
      ],
      [
        // The public client ID is required: an entry without one is unusable.
        { anthropic: { url: 'https://api.anthropic.com/v1/oauth/token' } },
        /clientId/,
      ],
      [
        {
          anthropic: {
            url: 'https://api.anthropic.com/v1/oauth/token',
            clientId: '',
          },
        },
        /clientId/,
      ],
      [
        // The bare-URL shape of the previous unpublished schema now
        // surfaces the crafted endpoint guidance rather than the config
        // reader's raw type error.
        { anthropic: 'https://api.anthropic.com/v1/oauth/token' },
        /Expected the provider's trusted token endpoint as an object/,
      ],
      [
        {
          anthropic: entry('https://api.anthropic.com/v1/oauth/token'),
          other: entry('https://api.anthropic.com/v1/oauth/token'),
        },
        /more than one provider/,
      ],
    ];
    for (const [tokenEndpoints, expected] of invalid) {
      expect(() =>
        parse({
          ai: { credentials: credentialsSection({ tokenEndpoints }) },
        }),
      ).toThrow(expected);
    }
    expect(() =>
      parse({
        ai: { credentials: credentialsSection({ tokenEndpoints: 'x' }) },
      }),
    ).toThrow(/tokenEndpoints/);
  });

  it('keeps mcp: credential keys as legitimate tool credentials', () => {
    // Org/service config maps are also where installation-scoped MCP tool
    // server credentials live; the reservation applies to model provider
    // ids, not to these keys.
    const parsed = parse({
      ai: {
        credentials: {
          encryptionKey: KEY_BASE64,
          scopes: {
            org: {
              openai: { type: 'api_key', key: 'sk-org' },
              'mcp:internal-tools': { type: 'api_key', key: 'tool-token' },
            },
          },
        },
      },
    });
    expect(
      parsed.credentials?.scopes.get('org')?.get('mcp:internal-tools'),
    ).toBeTruthy();
  });

  it('treats credential entries as opaque', () => {
    // Kind interpretation belongs to the credential stores, not the schema:
    // an entry that is not a usable credential parses fine here and is
    // rejected by the store constructor instead.
    const parsed = parse({
      ai: {
        credentials: credentialsSection({
          scopes: {
            org: { 'future-sigv4': { kind: 'sigv4', region: 'eu-1' } },
          },
        }),
      },
    });
    expect(parsed.credentials!.scopes.get('org')?.get('future-sigv4')).toEqual({
      kind: 'sigv4',
      region: 'eu-1',
    });
  });
});
