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
import { parseLocationAnnotation } from './helpers';
import {
  TemplateEntityV1alpha1,
  LOCATION_ANNOTATION,
} from '@backstage/catalog-model';

describe('Helpers', () => {
  describe('parseLocationAnnotation', () => {
    it('throws an exception when no annotation location', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            // [LOCATION_ANNOTATION]:
            //   'github:https://github.com/benjdlambert/backstage-graphql-template/blob/master/template.yaml',
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

      expect(() => parseLocationAnnotation(mockEntity)).toThrow(
        expect.objectContaining({
          name: 'InputError',
          message: `No location annotation provided in entity: ${mockEntity.metadata.name}`,
        }),
      );
    });

    it('should throw an error when the protocol part is not set in the location annotation', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            [LOCATION_ANNOTATION]:
              ':https://github.com/benjdlambert/backstage-graphql-template/blob/master/template.yaml',
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

      expect(() => parseLocationAnnotation(mockEntity)).toThrow(
        expect.objectContaining({
          name: 'InputError',
          message: `Failure to parse either protocol or location for entity: ${mockEntity.metadata.name}`,
        }),
      );
    });
    it('should throw an error when the location part is not set in the location annotation', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            [LOCATION_ANNOTATION]: 'github:',
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

      expect(() => parseLocationAnnotation(mockEntity)).toThrow(
        expect.objectContaining({
          name: 'InputError',
          message: `Failure to parse either protocol or location for entity: ${mockEntity.metadata.name}`,
        }),
      );
    });

    it('should parse the location and protocol correctly for simple locations', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            [LOCATION_ANNOTATION]: 'file:./path',
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

      expect(parseLocationAnnotation(mockEntity)).toEqual({
        protocol: 'file',
        location: './path',
      });
    });

    it('should parse the location and protocol correctly for complex with unescaped locations', () => {
      const mockEntity: TemplateEntityV1alpha1 = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Template',
        metadata: {
          annotations: {
            [LOCATION_ANNOTATION]: 'github:https://lol.com/:something/shello',
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

      expect(parseLocationAnnotation(mockEntity)).toEqual({
        protocol: 'github',
        location: 'https://lol.com/:something/shello',
      });
    });
  });
});
