/*
 * Copyright 2021 The Backstage Authors
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
import camelCase from 'lodash/camelCase';
import { Entity } from '@backstage/catalog-model';
import { get } from 'lodash';
import {
  FactLifecycle,
  MaxItems,
  TTL,
} from '@backstage/plugin-tech-insights-node';

export const generateAnnotationFactName = (annotation: string) =>
  camelCase(`hasAnnotation-${annotation}`);

export const entityHasAnnotation = (entity: Entity, annotation: string) =>
  Boolean(get(entity, ['metadata', 'annotations', annotation]));

export const isTtl = (lifecycle: FactLifecycle): lifecycle is TTL => {
  return !!(lifecycle as TTL).timeToLive;
};

export const isMaxItems = (lifecycle: FactLifecycle): lifecycle is MaxItems => {
  return !!(lifecycle as MaxItems).maxItems;
};
