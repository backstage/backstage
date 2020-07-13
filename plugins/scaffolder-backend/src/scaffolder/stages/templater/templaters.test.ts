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
import { Templaters } from '.';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { CookieCutter } from './cookiecutter';

describe('Templaters', () => {
  const mockTemplate: TemplateEntityV1alpha1 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Template',
    metadata: {
      annotations: {
        'backstage.io/managed-by-location':
          'file:/Users/bingo/spotify/backstage/plugins/scaffolder-backend/sample-templates/react-ssr-template/template.yaml',
      },
      name: 'react-ssr-template',
      title: 'React SSR Template',
      description:
        'Next.js application skeleton for creating isomorphic web applications.',
      uid: '7357f4c5-aa58-4a1e-9670-18931eef771f',
      etag: 'YWUxZWQyY2EtZDkxMC00MDM0LWI0ODAtMDgwMWY0YzdlMWIw',
      generation: 1,
    },
    spec: {
      templater: 'cookiecutter',
      path: '.',
      type: 'website',
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        required: ['storePath', 'owner'],
        properties: {
          owner: {
            type: 'string',
            title: 'Owner',
            description: 'Who is going to own this component',
          },
          storePath: {
            type: 'string',
            title: 'Store path',
            description: 'GitHub store path in org/repo format',
          },
        },
      },
    },
  };
  it('should throw an error when the templater is not registered', () => {
    const templaters = new Templaters();

    expect(() => templaters.get(mockTemplate)).toThrow(
      expect.objectContaining({
        message: 'No templater registered for template: "cookiecutter"',
      }),
    );
  });
  it('should return the correct templater when the templater matches', () => {
    const templaters = new Templaters();
    const templater = new CookieCutter();

    templaters.register('cookiecutter', templater);

    expect(templaters.get(mockTemplate)).toBe(templater);
  });

  it('should throw an error if the templater does not exist in the entity', () => {
    const brokenTemplate: TemplateEntityV1alpha1 = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Template',
      metadata: {
        annotations: {},
        name: 'react-ssr-template',
        title: 'React SSR Template',
        description:
          'Next.js application skeleton for creating isomorphic web applications.',
        uid: '7357f4c5-aa58-4a1e-9670-18931eef771f',
        etag: 'YWUxZWQyY2EtZDkxMC00MDM0LWI0ODAtMDgwMWY0YzdlMWIw',
        generation: 1,
      },
      spec: {
        type: 'website',
        path: '.',
        templater: '',
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          required: ['storePath', 'owner'],
          properties: {
            owner: {
              type: 'string',
              title: 'Owner',
              description: 'Who is going to own this component',
            },
            storePath: {
              type: 'string',
              title: 'Store path',
              description: 'GitHub store path in org/repo format',
            },
          },
        },
      },
    };

    const templaters = new Templaters();

    expect(() => templaters.get(brokenTemplate)).toThrow(
      expect.objectContaining({
        name: 'InputError',
        message: expect.stringContaining(
          'Template does not have a required templating key',
        ),
      }),
    );
  });
});
