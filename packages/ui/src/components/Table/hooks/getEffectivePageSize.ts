/*
 * Copyright 2025 The Backstage Authors
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

import type { PageSizeOption } from '../../TablePagination/types';
import type { PaginationOptions } from './types';

const DEFAULT_PAGE_SIZE = 20;

function getOptionValue(option: number | PageSizeOption): number {
  return typeof option === 'number' ? option : option.value;
}

/** @internal */
export function getEffectivePageSize(
  paginationOptions: PaginationOptions,
): number {
  const { pageSize, pageSizeOptions } = paginationOptions;

  if (!pageSizeOptions) {
    return pageSize ?? DEFAULT_PAGE_SIZE;
  }

  const firstValue = getOptionValue(pageSizeOptions[0]);

  if (pageSize === undefined) {
    return firstValue;
  }

  const isValid = pageSizeOptions.some(opt => getOptionValue(opt) === pageSize);

  if (isValid) {
    return pageSize;
  }

  console.warn(
    `useTable: pageSize ${pageSize} is not in pageSizeOptions, using ${firstValue} instead`,
  );
  return firstValue;
}
