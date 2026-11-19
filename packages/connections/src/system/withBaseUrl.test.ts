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
import { z } from 'zod/v4';
import { connectionTypes } from '../definitions/types';
import type { ConnectionTypeDefinition } from '../api/ConnectionType';
import { InputError } from '@backstage/errors';
import { createConnectionType } from './createConnectionType';
import { getHostLookupIdentity } from './getHostLookupIdentity';
import { withBaseUrl } from './withBaseUrl';

describe('withBaseUrl', () => {
  it('combines provider configuration with a required base URL and host identity', () => {
    const schema = z.object({ project: z.string().min(1) });
    const options = withBaseUrl(schema);
    const definition = createConnectionType({
      type: 'example',
      title: 'Example',
      ...options,
      authMethods: [
        { method: 'none', title: 'None', configSchema: z.object({}) },
      ],
    });
    const parsed = definition.configSchema.parse({
      baseUrl: 'https://example.com:8443/context',
      project: 'test',
    });
    const baseUrl: string = parsed.baseUrl;
    const project: string = parsed.project;
    expect({ baseUrl, project }).toEqual({
      baseUrl: 'https://example.com:8443/context/',
      project: 'test',
    });
    expect(options.getLookupIdentity).toBe(getHostLookupIdentity);
    expect(definition.getLookupIdentity(parsed)).toEqual({
      key: 'host',
      value: 'example.com:8443',
    });
    expect(schema.shape).not.toHaveProperty('baseUrl');
    expect(parsed).not.toHaveProperty('host');
    expect(parsed).not.toHaveProperty('apiBaseUrl');
    expect(definition.configSchema.schema().schema).toMatchObject({
      type: 'object',
      required: ['project', 'baseUrl'],
      additionalProperties: false,
      properties: {
        project: { type: 'string', minLength: 1 },
        baseUrl: { type: 'string', format: 'uri' },
      },
    });
    for (const input of [
      { project: 'test' },
      { baseUrl: 'not a URL', project: 'test' },
      { baseUrl: 'https://example.com', project: '' },
      {
        baseUrl: 'https://example.com',
        project: 'test',
        apiBaseUrl: 'https://api.example.com',
      },
    ]) {
      expect(() => definition.configSchema.parse(input)).toThrow(InputError);
    }
  });

  it('requires a base URL for every URL-based type while keeping AWS account-based', () => {
    expect(connectionTypes.aws.configSchema.parse({})).toEqual({});
    expect(connectionTypes.aws.getLookupIdentity({})).toBeUndefined();
    const definitions: ConnectionTypeDefinition[] = Object.values(
      connectionTypes,
    ).filter(definition => definition.type !== 'aws');
    for (const definition of definitions) {
      const fields = {
        ...(definition.type === 'gerrit'
          ? { gitilesBaseUrl: 'https://gitiles.example.com/' }
          : {}),
        ...(definition.type === 'aws-codecommit'
          ? { region: 'us-east-1' }
          : {}),
      };
      const parsed = definition.configSchema.parse({
        ...fields,
        baseUrl: 'https://EXAMPLE.COM:8443/context',
      });
      expect(parsed).toEqual({
        ...fields,
        baseUrl: 'https://EXAMPLE.COM:8443/context/',
      });
      expect(definition.getLookupIdentity(parsed)).toEqual({
        key: 'host',
        value: 'example.com:8443',
      });
      expect(() => definition.configSchema.parse(fields)).toThrow(InputError);
      expect(() =>
        definition.configSchema.parse({
          ...fields,
          baseUrl: 'https://example.com/',
          host: 'example.com',
        }),
      ).toThrow(InputError);
    }
  });
});
