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

import type { PropDef, GetPropDefTypes } from '../../props/prop-def';

const columnsValues = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  'auto',
] as const;

/** @public */
const gridPropDefs = {
  columns: {
    type: 'enum | string',
    className: 'cu-columns',
    customProperties: ['--columns'],
    values: columnsValues,
    responsive: true,
    default: 'auto',
  },
} satisfies {
  columns: PropDef<(typeof columnsValues)[number]>;
};

/** @public */
const gridItemPropDefs = {
  colSpan: {
    type: 'enum | string',
    className: 'cu-col-span',
    customProperties: ['--col-span'],
    values: columnsValues,
    responsive: true,
  },
  colEnd: {
    type: 'enum | string',
    className: 'cu-col-end',
    customProperties: ['--col-end'],
    values: columnsValues,
    responsive: true,
  },
  colStart: {
    type: 'enum | string',
    className: 'cu-col-start',
    customProperties: ['--col-start'],
    values: columnsValues,
    responsive: true,
  },
  rowSpan: {
    type: 'enum | string',
    className: 'cu-row-span',
    customProperties: ['--row-span'],
    values: columnsValues,
    responsive: true,
  },
} satisfies {
  colSpan: PropDef<(typeof columnsValues)[number]>;
  colEnd: PropDef<(typeof columnsValues)[number]>;
  colStart: PropDef<(typeof columnsValues)[number]>;
  rowSpan: PropDef<(typeof columnsValues)[number]>;
};

/** @public */
type GridOwnProps = GetPropDefTypes<typeof gridPropDefs>;

/** @public */
type GridItemOwnProps = GetPropDefTypes<typeof gridItemPropDefs>;

export { gridPropDefs, gridItemPropDefs };
export type { GridOwnProps, GridItemOwnProps };
