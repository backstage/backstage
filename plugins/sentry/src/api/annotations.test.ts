/*
 * Copyright 2022 The Backstage Authors
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
import { Entity } from '@backstage/catalog-model';
import {
  getOrganization,
  getProjectSlug,
  SENTRY_PROJECT_SLUG_ANNOTATION,
} from './annotations';

const entity = (name?: string) =>
  ({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      annotations: {
        [SENTRY_PROJECT_SLUG_ANNOTATION]: name,
      },
      name: 'something',
    },
  } as Entity);

describe('sentry annotations', () => {
  it('getOrganization should works', () => {
    const data = [
      [entity('orgs/some'), 'orgs'],
      [entity('spotify/some'), 'spotify'],
      [entity('slug'), ''],
    ];

    data.map(([input, expected]) =>
      expect(getOrganization(input as Entity)).toBe(expected),
    );
  });
  it('getProjectSlug should works', () => {
    const data = [
      [entity('orgs/some'), 'some'],
      [entity('spotify/some'), 'some'],
      [entity('slug'), 'slug'],
      [entity(''), ''],
    ];

    data.map(([input, expected]) =>
      expect(getProjectSlug(input as Entity)).toBe(expected),
    );
  });
});
