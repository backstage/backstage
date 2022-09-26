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
/**
 * Common types and functionalities for the ADR plugin.
 * @packageDocumentation
 */
import { Entity, getEntitySourceLocation } from '@backstage/catalog-model';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { ScmIntegrationRegistry } from '@backstage/integration';

/**
 * ADR plugin annotation.
 * @public
 */
export const ANNOTATION_ADR_LOCATION = 'backstage.io/adr-location';

/**
 * Standard luxon DateTime format string for MADR dates.
 * @public
 */
export const MADR_DATE_FORMAT = 'yyyy-MM-dd';

/**
 * Utility function to get the value of an entity ADR annotation.
 * @public
 */
const getAdrLocationDir = (entity: Entity) =>
  entity.metadata.annotations?.[ANNOTATION_ADR_LOCATION]?.trim();

/**
 * Utility function to determine if the given entity has ADRs.
 * @public
 */
export const isAdrAvailable = (entity: Entity) =>
  Boolean(getAdrLocationDir(entity));

/**
 * Utility function to extract the ADR location URL from an entity based off
 * its ADR annotation and relative to the entity source location.
 * @public
 */
export const getAdrLocationUrl = (
  entity: Entity,
  scmIntegration: ScmIntegrationRegistry,
) => {
  if (!isAdrAvailable(entity)) {
    throw new Error(`Missing ADR annotation: ${ANNOTATION_ADR_LOCATION}`);
  }

  return scmIntegration.resolveUrl({
    url: getAdrLocationDir(entity)!,
    base: getEntitySourceLocation(entity).target,
  });
};

/**
 * File path filter function type for ADR filenames
 * @public
 */
export type AdrFilePathFilterFn = (path: string) => boolean;

/**
 * File path filter for MADR filename formats
 * @public
 */
export const madrFilePathFilter: AdrFilePathFilterFn = (path: string) =>
  /^\d{4}-.+\.md$/.test(path);

/**
 * ADR indexable document interface
 * @public
 */
export interface AdrDocument extends IndexableDocument {
  /**
   * Ref of the entity associated with this ADR
   */
  entityRef: string;
  /**
   * Title of the entity associated with this ADR
   */
  entityTitle?: string;
  /**
   * ADR status label
   */
  status?: string;
  /**
   * ADR date
   */
  date?: string;
}
