/*
 * Copyright 2020 The Backstage Authors
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

export const SENTRY_PROJECT_SLUG_ANNOTATION = 'sentry.io/project-slug';

// The value can be the format of `[organization]/[project-slug]` or just `[project-slug]
const parseAnnotation = (entity: Entity) => {
  return (entity?.metadata.annotations?.[SENTRY_PROJECT_SLUG_ANNOTATION] ?? '')
    .split('/')
    .reverse();
};

export const getProjectSlug = (entity: Entity) => {
  const [projectSlug, _] = parseAnnotation(entity);
  return projectSlug ?? '';
};

export const getOrganization = (entity: Entity) => {
  const [_, organization] = parseAnnotation(entity);
  return organization ?? '';
};
