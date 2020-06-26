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
import { JobProcessor } from './processor';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import Docker from 'dockerode';
import { CookieCutter } from '../templater/cookiecutter';
import { Preparers } from '../';

describe('JobProcessor', () => {
  const mockEntity: TemplateEntityV1alpha1 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Template',
    metadata: {
      annotations: {
        'backstage.io/managed-by-location':
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
      type: 'cookiecutter',
      path: './template',
    },
  };

  describe('create', () => {
    const templater = new CookieCutter();
    const preparers = new Preparers();
    const mockDocker = {} as jest.Mocked<Docker>;
    it('creates a new job', async () => {
      const processor = new JobProcessor({
        dockerClient: mockDocker,
        preparers,
        templater,
      });

      const job = processor.create(mockEntity, { component_id: 'bob' });

      expect(job.id).toMatch(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      );
    });
  });

  describe('process', () => {
    it.todo('allows running of a job in a pending state');
    it.todo('fails when the job is not in a pending state');
    it.todo('calls the preparer with the entity');
    it.todo('calls the templater with the correct directory');
  });
});
