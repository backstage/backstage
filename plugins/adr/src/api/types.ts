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

import { createApiRef } from '@backstage/core-plugin-api';

/**
 * Contains information about an ADR file.
 *
 * @public
 */
export type AdrFileInfo = {
  /** The file type. */
  type: string;

  /** The relative path of the ADR file. */
  path: string;

  /** The name of the ADR file. */
  name: string;
};

/**
 * The result of listing ADRs.
 *
 * @public
 */
export type AdrListResult = {
  data: AdrFileInfo[];
};

/**
 * The result of reading an ADR.
 *
 * @public
 */
export type AdrReadResult = {
  /** The contents of the read ADR file. */
  data: string;
};

/**
 * The API used by the adr plugin to list and read ADRs.
 *
 * @public
 */
export interface AdrApi {
  /** Lists the ADRs at the provided url. */
  listAdrs(url: string): Promise<AdrListResult>;

  /** Reads the contents of the ADR at the provided url. */
  readAdr(url: string): Promise<AdrReadResult>;
}

/**
 * ApiRef for the AdrApi.
 *
 * @public
 */
export const adrApiRef = createApiRef<AdrApi>({
  id: 'plugin.adr.api',
});
