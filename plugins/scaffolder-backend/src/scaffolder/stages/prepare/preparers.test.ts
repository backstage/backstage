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
import { Preparers } from '.';
import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import { FilePreparer } from './file';

describe('Preparers', () => {
  const mockTemplate: TemplateEntityV1alpha1 = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Template',
    metadata: {
      annotations: {
        'backstage.io/managed-by-location':
          'file:/Users/blam/dev/spotify/backstage/plugins/scaffolder-backend/sample-templates/react-ssr-template/template.yaml',
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
      type: 'cookiecutter',
      path: '.',
    },
  };
  it('should throw an error when the preparer for the source location is not registered', () => {
    const preparers = new Preparers();

    expect(() => preparers.get(mockTemplate)).toThrow(
      expect.objectContaining({
        message: 'No preparer registered for type: "file"',
      }),
    );
  });
  it('should return the correct preparer when the source matches', () => {
    const preparers = new Preparers();
    const preparer = new FilePreparer();

    preparers.register('file', preparer);

    expect(preparers.get(mockTemplate)).toBe(preparer);
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
        type: 'cookiecutter',
        path: '.',
      },
    };

    const preparers = new Preparers();

    expect(() => preparers.get(brokenTemplate)).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('No location annotation provided'),
      }),
    );
  });
});
