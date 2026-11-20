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

import { createHash } from 'node:crypto';
import { assertDestination, assertOperation } from '../journal/redaction';
import { fixtureProviderModules } from '@backstage/ai-node-test-utils/alpha';

const azureResponses = fixtureProviderModules.find(
  module => module.id === 'azure-openai-responses',
)!;
import { createProviderRegistry } from './registry';
import type { AiProviderModule } from './types';

describe('provider registration', () => {
  it('registers new operations and digest-only routes without editing the journal', () => {
    const module: AiProviderModule = {
      ...azureResponses,
      id: 'example-classifier',
      credentialKinds: ['api_key'],
      certifiedOperations: ['classify', 'rerankV2'],
      destinationTemplates: [
        [
          { literal: '/v1/projects/' },
          { digest: 'project' },
          { literal: '/locations/' },
          { digest: 'location' },
          { literal: '/classify' },
        ],
      ],
    };
    const registry = createProviderRegistry([module]);
    const hash = (value: string) =>
      createHash('sha256').update(value).digest('hex').slice(0, 16);
    const expected = `https://example.com/v1/projects/{project=${hash(
      'private/project',
    )}}/locations/{location=${hash('west')}}/classify`;
    expect(assertOperation('models.rerankV2', registry)).toBe(
      'models.rerankV2',
    );
    expect(() => assertOperation('models.notRegistered', registry)).toThrow();
    expect(
      assertDestination(
        'https://example.com/v1/projects/private%2Fproject/locations/west/classify',
        'models.classify',
        'destination',
        registry,
      ),
    ).toBe(expected);
    expect(() =>
      assertDestination(
        'https://example.com/v1/projects/ghp_123456789012345678901234/locations/west/classify',
        'models.classify',
        'destination',
        registry,
      ),
    ).toThrow('secret-shaped');
    expect(() =>
      assertDestination(
        'https://example.com/v1/projects/private/locations/west/other',
        'models.classify',
        'destination',
        registry,
      ),
    ).toThrow('no approved route');
  });

  it('never lets an overlapping static route reveal a dynamic value', () => {
    const staticModule: AiProviderModule = {
      ...azureResponses,
      id: 'static-route',
      destinationTemplates: [[{ literal: '/v1/projects/private/predict' }]],
    };
    const dynamicModule: AiProviderModule = {
      ...azureResponses,
      id: 'dynamic-route',
      destinationTemplates: [
        [
          { literal: '/v1/projects/' },
          { digest: 'project' },
          { literal: '/predict' },
        ],
      ],
    };
    const path = '/v1/projects/private/predict';
    const digest = createHash('sha256')
      .update('private')
      .digest('hex')
      .slice(0, 16);
    const registry = createProviderRegistry([staticModule, dynamicModule]);
    expect(registry.canonicalPath(path)).toBe(
      `/v1/projects/{project=${digest}}/predict`,
    );
    const conflicting = createProviderRegistry([
      staticModule,
      dynamicModule,
      {
        ...dynamicModule,
        id: 'different-dynamic',
        destinationTemplates: [
          [
            { literal: '/v1/projects/' },
            { digest: 'account' },
            { literal: '/predict' },
          ],
        ],
      },
    ]);
    expect(conflicting.canonicalPath(path)).toBeUndefined();
  });

  it('reserves static OAuth paths for journal-owned auth operations', () => {
    for (const template of [
      [{ literal: '/oauth/token' }],
      [{ literal: '/v1/oauth/token' }],
      [{ literal: '/v1/' }, { literal: 'oauth/token' }],
      [{ literal: '/oauth/authorize' }],
      [{ literal: '/v1/oauth-custom' }],
    ]) {
      expect(() =>
        createProviderRegistry([
          { ...azureResponses, destinationTemplates: [template] },
        ]),
      ).toThrow('reserved authentication route');
    }
    const registry = createProviderRegistry([azureResponses]);
    expect(
      assertDestination(
        'https://auth.example/v1/oauth/token',
        'auth.token',
        'destination',
        registry,
      ),
    ).toBe('https://auth.example/v1/oauth/token');
    expect(() =>
      assertDestination(
        'https://auth.example/v1/oauth/token',
        'models.stream',
        'destination',
        registry,
      ),
    ).toThrow('no approved route');
    expect(() =>
      createProviderRegistry([
        {
          ...azureResponses,
          destinationTemplates: [
            [{ literal: '/v1/authorize' }],
            [{ literal: '/oauth/' }, { digest: 'name' }],
          ],
        },
      ]),
    ).not.toThrow();
  });

  it('rejects invalid, empty and duplicate credential kinds', () => {
    // A module must declare at least one consumable kind, only known kinds,
    // and no duplicates: the declaration is what dispatch and composition
    // check credentials against, so a malformed one would silently accept or
    // refuse the wrong credential.
    for (const credentialKinds of [
      [],
      ['api_key', 'api_key'],
      ['api_key', 'client_secret'],
      ['oauth', 'api_key', 'oauth'],
      'api_key',
      undefined,
    ]) {
      expect(() =>
        createProviderRegistry([
          { ...azureResponses, credentialKinds } as unknown as AiProviderModule,
        ]),
      ).toThrow('Invalid provider credential kinds');
    }
    expect(() =>
      createProviderRegistry([
        { ...azureResponses, credentialKinds: ['api_key'] },
        { ...azureResponses, credentialKinds: ['oauth'] },
      ]),
    ).toThrow('duplicate');
    expect(() =>
      createProviderRegistry([
        { ...azureResponses, credentialKinds: ['api_key'] },
        { ...azureResponses, id: 'example-oauth', credentialKinds: ['oauth'] },
      ]),
    ).not.toThrow();
  });

  it('fails registration for ambiguous or cleartext dynamic declarations', () => {
    for (const template of [
      [],
      [{ literal: '/v1/{secret}' }],
      [{ literal: '/v1/' }, { dynamic: 'secret' }],
      [{ literal: '/v1/' }, { digest: 'secret', emit: 'plaintext' }],
      [{ literal: '/v1/' }, { digest: 'one' }, { digest: 'two' }],
    ]) {
      expect(() =>
        createProviderRegistry([
          {
            ...azureResponses,
            destinationTemplates: [template],
          } as unknown as AiProviderModule,
        ]),
      ).toThrow('Invalid destination template');
    }
    expect(() =>
      createProviderRegistry([azureResponses, azureResponses]),
    ).toThrow('duplicate');
  });
});
