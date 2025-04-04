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
import * as React from 'react';
import { Text } from '../Text';
import { TablePaginationProps } from './types';
import { Button } from '../Button';

/** @public */
const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  ({ className, ...props }, ref) => {
    const {
      pageIndex,
      pageSize,
      onClickPrevious,
      onClickNext,
      canPrevious,
      canNext,
      totalRows,
      setPageSize,
    } = props;
    return (
      <div
        ref={ref}
        className={['canon-TablePagination', className].join(' ')}
        {...props}
      >
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <div className="canon-TablePagination-info">
          <Text variant="body">{`${pageIndex * pageSize + 1} - ${
            (pageIndex + 1) * pageSize
          } of ${totalRows}`}</Text>
        </div>
        <div className="canon-TablePagination-buttons">
          <Button
            variant="secondary"
            size="small"
            onClick={onClickPrevious}
            disabled={!canPrevious}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={onClickNext}
            disabled={!canNext}
          >
            Next
          </Button>
        </div>
      </div>
    );
  },
);
TablePagination.displayName = 'TablePagination';

export { TablePagination };
