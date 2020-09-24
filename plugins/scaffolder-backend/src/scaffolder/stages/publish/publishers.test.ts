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
import { Publishers } from './publishers';
import {
  LOCATION_ANNOTATION,
  TemplateEntityV1alpha1,
} from '@backstage/catalog-model';
import { GithubPublisher } from './github';
import { Octokit } from '@octokit/rest';

jest.mock('@octokit/rest');

describe('Publishers', () => {
  const mockTemplate: TemplateEntityV1alpha1 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Template',
    metadata: {
      annotations: {
        [LOCATION_ANNOTATION]:
          'github:https://github.com/benjdlambert/backstage-graphql-template/blob/master/template.yaml',
      },
      name: 'graphql-starter',
      title: 'GraphQL Service',
      description:
        'A GraphQL starter template for backstage to get you up and running\nthe best pracices with GraphQL\n',
      uid: '9cf16bad-16e0-4213-b314-c4eec773c50b',
      etag: 'ZTkxMjUxMjUtYWY3Yi00MjU2LWFkYWMtZTZjNjU5ZjJhOWM2',
      generation: 1,
    },
    spec: {
      type: 'website',
      templater: 'cookiecutter',
      path: './template',
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

  it('should throw an error when the publisher for the source location is not registered', () => {
    const publishers = new Publishers();

    expect(() => publishers.get(mockTemplate)).toThrow(
      expect.objectContaining({
        message: 'No publisher registered for type: "github"',
      }),
    );
  });

  it('should return the correct preparer when the source matches', () => {
    const publishers = new Publishers();
    const publisher = new GithubPublisher({
      client: new Octokit(),
      token: 'fake',
      repoVisibility: 'public',
    });
    publishers.register('github', publisher);

    expect(publishers.get(mockTemplate)).toBe(publisher);
  });

  it('should throw an error if the metadata tag does not exist in the entity', () => {
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
        templater: 'cookiecutter',
        path: '.',
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

    const publishers = new Publishers();

    expect(() => publishers.get(brokenTemplate)).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('No location annotation provided'),
      }),
    );
  });
});
