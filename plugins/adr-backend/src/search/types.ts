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
import { AdrDocument } from '@backstage/plugin-adr-common';

/**
 * Context passed to a AdrParser.
 * @public
 */
export type AdrParserContext = {
  /**
   * The entity associated with the ADR.
   */
  entity: Entity;
  /**
   * The ADR content string.
   */
  content: string;
  /**
   * The ADR file path.
   */
  path: string;
};

/**
 * ADR parser function type.
 * @public
 */
export type AdrParser = (ctx: AdrParserContext) => Promise<AdrDocument>;
