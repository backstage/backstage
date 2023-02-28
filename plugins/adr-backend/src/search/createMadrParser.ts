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

import { stringifyEntityRef } from '@backstage/catalog-model';
import { MADR_DATE_FORMAT } from '@backstage/plugin-adr-common';

import { AdrParser } from './types';
import { madrParser } from './madrParser';

const applyArgsToFormat = (
  format: string,
  args: Record<string, string>,
): string => {
  let formatted = format;
  for (const [key, value] of Object.entries(args)) {
    formatted = formatted.replace(`:${key}`, value);
  }
  return formatted.toLowerCase();
};

const DEFAULT_LOCATION_TEMPLATE =
  '/catalog/:namespace/:kind/:name/adrs?record=:record';

/**
 *
 * Options for the default MADR content parser
 * @public
 */
export type MadrParserOptions = {
  /**
   * Location template for the route of the frontend plugin
   * Defaults to '/catalog/:namespace/:kind/:name/adrs?record=:record'
   */
  locationTemplate?: string;
  /**
   * luxon DateTime format string to parse ADR dates with.
   * Defaults to 'yyyy-MM-dd'
   */
  dateFormat?: string;
};

/**
 * Default content parser for ADRs following the MADR template (https://adr.github.io/madr/)
 * @public
 */
export const createMadrParser = (
  options: MadrParserOptions = {},
): AdrParser => {
  const locationTemplate =
    options.locationTemplate ?? DEFAULT_LOCATION_TEMPLATE;
  const dateFormat = options.dateFormat ?? MADR_DATE_FORMAT;

  return async ({ entity, content, path }) => {
    const madr = madrParser(content, dateFormat);
    return {
      title: madr.title ?? path.replace(/\.md$/, ''),
      text: content,
      status: madr.status,
      date: madr.date,
      entityRef: stringifyEntityRef(entity),
      entityTitle: entity.metadata.title,
      location: applyArgsToFormat(locationTemplate, {
        namespace: entity.metadata.namespace || 'default',
        kind: entity.kind,
        name: entity.metadata.name,
        record: path,
      }),
    };
  };
};
