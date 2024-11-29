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

import { Entity, isGroupEntity, isUserEntity } from '@backstage/catalog-model';
import { TechDocsCollatorEntityTransformer } from './TechDocsCollatorEntityTransformer';

const getDocumentText = (entity: Entity): string => {
  const documentTexts: string[] = [];
  documentTexts.push(entity.metadata.description || '');

  if (isUserEntity(entity) || isGroupEntity(entity)) {
    if (entity.spec?.profile?.displayName) {
      documentTexts.push(entity.spec.profile.displayName);
    }
  }

  if (isUserEntity(entity)) {
    if (entity.spec?.profile?.email) {
      documentTexts.push(entity.spec.profile.email);
    }
  }

  return documentTexts.join(' : ');
};

/** @public */
export const defaultTechDocsCollatorEntityTransformer: TechDocsCollatorEntityTransformer =
  (entity: Entity) => {
    return {
      kind: entity.kind,
      namespace: entity.metadata.namespace || 'default',
      annotations: entity.metadata.annotations || '',
      name: entity.metadata.name || '',
      title: entity.metadata.title || '',
      text: getDocumentText(entity),
      componentType: entity.spec?.type?.toString() || 'other',
      type: entity.spec?.type?.toString() || 'other',
      lifecycle: (entity.spec?.lifecycle as string) || '',
      owner: (entity.spec?.owner as string) || '',
      path: '',
    };
  };
