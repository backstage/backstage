/*
 * Copyright 2024 The Backstage Authors
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

import type { ComponentDefinition } from '../../types';

/**
 * Component definition for Table
 * @public
 */
export const TableDefinition = {
  classNames: {
    table: 'bui-Table',
    header: 'bui-TableHeader',
    body: 'bui-TableBody',
    row: 'bui-TableRow',
    head: 'bui-TableHead',
    headContent: 'bui-TableHeadContent',
    headSortButton: 'bui-TableHeadSortButton',
    caption: 'bui-TableCaption',
    cell: 'bui-TableCell',
    cellContentWrapper: 'bui-TableCellContentWrapper',
    cellContent: 'bui-TableCellContent',
    cellIcon: 'bui-TableCellIcon',
    cellProfileAvatar: 'bui-TableCellProfileAvatar',
    cellProfileAvatarImage: 'bui-TableCellProfileAvatarImage',
    cellProfileAvatarFallback: 'bui-TableCellProfileAvatarFallback',
    cellProfileName: 'bui-TableCellProfileName',
    cellProfileLink: 'bui-TableCellProfileLink',
    headSelection: 'bui-TableHeadSelection',
    cellSelection: 'bui-TableCellSelection',
  },
  dataAttributes: {
    stale: [true, false] as const,
  },
} as const satisfies ComponentDefinition;
