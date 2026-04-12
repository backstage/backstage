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

import { TableBody } from './TableBody';
import { Row } from './Row';
import { Cell } from './Cell';
import { Skeleton } from '../../Skeleton';

const SKELETON_ROW_COUNT = 5;
const SKELETON_WIDTHS = ['75%', '50%', '60%', '45%', '70%'];

const skeletonItems = Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => ({
  id: `skeleton-${i}`,
  index: i,
}));

/**
 * A table body that renders animated skeleton rows as a loading placeholder.
 *
 * @remarks
 * Accepts any column array whose items have an `id` property, making it
 * compatible with both `ColumnConfig` and custom column types.
 *
 * @public
 */
export function TableBodySkeleton<T extends { id: string }>({
  columns,
}: {
  columns: readonly T[];
}) {
  return (
    <TableBody items={skeletonItems} dependencies={[columns]}>
      {item => {
        const rowIndex = item.index;
        return (
          <Row id={item.id} columns={columns}>
            {column => (
              <Cell key={column.id} aria-hidden="true">
                <Skeleton
                  width={
                    SKELETON_WIDTHS[
                      (rowIndex + columns.indexOf(column)) %
                        SKELETON_WIDTHS.length
                    ]
                  }
                />
              </Cell>
            )}
          </Row>
        );
      }}
    </TableBody>
  );
}
