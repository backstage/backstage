/*
 * Copyright 2023 The Backstage Authors
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

/**
 * Spectral linter plugin annotation.
 * @public
 */
export const ANNOTATION_SPECTRAL_RULESET_URL =
  'backstage.io/spectral-ruleset-url';

/**
 * Utility function to get the value of an entity Spectral linter annotation.
 * @public
 */
export const getSpectralRulesetUrl = (entity: Entity) =>
  entity.metadata.annotations?.[ANNOTATION_SPECTRAL_RULESET_URL]?.trim();

/**
 * Utility function to determine if the given entity can be linted.
 * @public
 */
export const isApiDocsSpectralLinterAvailable = (entity: Entity) =>
  Boolean(entity.kind === 'API') &&
  Boolean(entity.spec?.type === 'openapi' || entity.spec?.type === 'asyncapi');
