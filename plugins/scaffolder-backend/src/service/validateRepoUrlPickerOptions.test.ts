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
import { ScmIntegrations } from '@backstage/integration';
import { validateRepoUrlPickerOptions } from './validateRepoUrlPickerOptions';

const integrations = ScmIntegrations.fromConfig(
  new ConfigReader({
    integrations: {
      github: [{ host: 'github.com', token: 'irrelevant' }],
      gitlab: [{ host: 'gitlab.com', token: 'irrelevant' }],
      bitbucketCloud: [
        { host: 'bitbucket.org', username: 'u', appPassword: 'p' },
      ],
      azure: [
        { host: 'dev.azure.com', credentials: [{ personalAccessToken: 'p' }] },
      ],
    },
  }),
);

describe('validateRepoUrlPickerOptions', () => {
  const githubPickerParameters = {
    type: 'object',
    properties: {
      repoUrl: {
        type: 'string',
        'ui:field': 'RepoUrlPicker',
        'ui:options': {
          allowedHosts: ['github.com'],
          allowedOwners: ['trusted-org', 'other-trusted-org'],
        },
      },
    },
  };

  it('returns no errors when the value matches every allowlist', () => {
    const errors = validateRepoUrlPickerOptions(
      { repoUrl: 'github.com?owner=trusted-org&repo=my-repo' },
      githubPickerParameters,
      integrations,
    );
    expect(errors).toEqual([]);
  });

  it('returns an error when the owner is not in allowedOwners', () => {
    const errors = validateRepoUrlPickerOptions(
      { repoUrl: 'github.com?owner=attacker-org&repo=my-repo' },
      githubPickerParameters,
      integrations,
    );
    expect(errors).toEqual([
      {
        path: [],
        property: 'instance.repoUrl',
        message: expect.stringMatching(
          /owner 'attacker-org' is not in the allowed list.*allowedOwners.*trusted-org/,
        ),
        schema: {},
        instance: {},
        name: 'allowedOwners',
        argument: { allowed: ['trusted-org', 'other-trusted-org'] },
        stack: expect.stringContaining('instance.repoUrl'),
      },
    ]);
  });

  it('returns an error when the host is not in allowedHosts', () => {
    const errors = validateRepoUrlPickerOptions(
      { repoUrl: 'gitlab.com?owner=trusted-org&repo=my-repo' },
      githubPickerParameters,
      integrations,
    );
    expect(errors).toEqual([
      expect.objectContaining({
        property: 'instance.repoUrl',
        message: expect.stringMatching(
          /host 'gitlab.com' is not in the allowed list.*allowedHosts/,
        ),
      }),
    ]);
  });

  it('reports both host and owner violations independently', () => {
    const errors = validateRepoUrlPickerOptions(
      { repoUrl: 'gitlab.com?owner=attacker-org&repo=my-repo' },
      githubPickerParameters,
      integrations,
    );
    expect(errors).toHaveLength(2);
    expect(errors.map(e => e.message).join(' ')).toMatch(/host 'gitlab.com'/);
    expect(errors.map(e => e.message).join(' ')).toMatch(
      /owner 'attacker-org'/,
    );
  });

  it('passes through when the field has no allowlists configured', () => {
    const parameters = {
      type: 'object',
      properties: {
        repoUrl: {
          type: 'string',
          'ui:field': 'RepoUrlPicker',
          'ui:options': {},
        },
      },
    };
    const errors = validateRepoUrlPickerOptions(
      { repoUrl: 'github.com?owner=attacker-org&repo=my-repo' },
      parameters,
      integrations,
    );
    expect(errors).toEqual([]);
  });

  it('ignores empty-array allowlists (treated as not configured)', () => {
    const parameters = {
      type: 'object',
      properties: {
        repoUrl: {
          type: 'string',
          'ui:field': 'RepoUrlPicker',
          'ui:options': {
            allowedOwners: [],
          },
        },
      },
    };
    const errors = validateRepoUrlPickerOptions(
      { repoUrl: 'github.com?owner=anyone&repo=my-repo' },
      parameters,
      integrations,
    );
    expect(errors).toEqual([]);
  });

  it('walks nested object properties', () => {
    const parameters = {
      type: 'object',
      properties: {
        repository: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              'ui:field': 'RepoUrlPicker',
              'ui:options': {
                allowedOwners: ['trusted-org'],
              },
            },
          },
        },
      },
    };
    const errors = validateRepoUrlPickerOptions(
      {
        repository: {
          url: 'github.com?owner=attacker-org&repo=my-repo',
        },
      },
      parameters,
      integrations,
    );
    expect(errors).toEqual([
      expect.objectContaining({
        property: 'instance.repository.url',
        message: expect.stringMatching(/attacker-org/),
      }),
    ]);
  });

  it('walks schema composition (anyOf/oneOf/allOf)', () => {
    const parameters = {
      type: 'object',
      properties: {
        repoUrl: {
          allOf: [
            {
              type: 'string',
              'ui:field': 'RepoUrlPicker',
              'ui:options': {
                allowedOwners: ['trusted-org'],
              },
            },
          ],
        },
      },
    };
    const errors = validateRepoUrlPickerOptions(
      { repoUrl: 'github.com?owner=attacker-org&repo=my-repo' },
      parameters,
      integrations,
    );
    expect(errors).toEqual([
      expect.objectContaining({
        property: 'instance.repoUrl',
        message: expect.stringMatching(/attacker-org/),
      }),
    ]);
  });

  it('validates against allowedProjects and allowedRepos for Bitbucket', () => {
    const parameters = {
      type: 'object',
      properties: {
        repoUrl: {
          type: 'string',
          'ui:field': 'RepoUrlPicker',
          'ui:options': {
            allowedOwners: ['my-workspace'],
            allowedProjects: ['TRUSTED-PROJECT'],
            allowedRepos: ['allowed-repo'],
          },
        },
      },
    };
    const ok = validateRepoUrlPickerOptions(
      {
        repoUrl:
          'bitbucket.org?workspace=my-workspace&owner=my-workspace&project=TRUSTED-PROJECT&repo=allowed-repo',
      },
      parameters,
      integrations,
    );
    expect(ok).toEqual([]);

    const bad = validateRepoUrlPickerOptions(
      {
        repoUrl:
          'bitbucket.org?workspace=my-workspace&owner=my-workspace&project=OTHER-PROJECT&repo=allowed-repo',
      },
      parameters,
      integrations,
    );
    expect(bad).toEqual([
      expect.objectContaining({
        message: expect.stringMatching(/project 'OTHER-PROJECT'/),
      }),
    ]);
  });

  it('reports a parse error against the field when the value is malformed', () => {
    const parameters = {
      type: 'object',
      properties: {
        repoUrl: {
          type: 'string',
          'ui:field': 'RepoUrlPicker',
          'ui:options': {
            allowedOwners: ['trusted-org'],
          },
        },
      },
    };
    const errors = validateRepoUrlPickerOptions(
      { repoUrl: 'not a url at all' },
      parameters,
      integrations,
    );
    expect(errors).toEqual([
      expect.objectContaining({
        property: 'instance.repoUrl',
        message: expect.stringMatching(/not a valid repository URL/),
      }),
    ]);
  });

  it('ignores non-string values (handled by JSON Schema)', () => {
    const errors = validateRepoUrlPickerOptions(
      { repoUrl: 42 },
      githubPickerParameters,
      integrations,
    );
    expect(errors).toEqual([]);
  });

  it('ignores fields that are not RepoUrlPicker', () => {
    const parameters = {
      type: 'object',
      properties: {
        unrelated: {
          type: 'string',
          'ui:field': 'EntityPicker',
          'ui:options': {
            allowedOwners: ['trusted-org'],
          },
        },
      },
    };
    const errors = validateRepoUrlPickerOptions(
      { unrelated: 'whatever' },
      parameters,
      integrations,
    );
    expect(errors).toEqual([]);
  });
});
