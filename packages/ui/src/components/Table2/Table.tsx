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
import { TableProps } from './types';
import { TablePagination } from '../TablePagination2';
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableRoot,
} from './components';

export const Table = (props: TableProps) => {
  const { columns, data, pagination, loading, error } = props;

  return (
    <>
      {error && (
        <div style={{ color: 'red', padding: '10px' }}>
          Error: {error.message}
        </div>
      )}
      {loading && <div style={{ padding: '10px' }}>Loading...</div>}
      <TableRoot {...props}>
        <TableHeader columns={columns}>
          {column => (
            <Column isRowHeader={column.isRowHeader}>{column.name}</Column>
          )}
        </TableHeader>
        <TableBody items={data} dependencies={[columns]}>
          {item => (
            <Row columns={columns}>
              {column => <Cell>{item[column.id]}</Cell>}
            </Row>
          )}
        </TableBody>
      </TableRoot>
      {pagination && (
        <TablePagination
          fromCount={pagination.fromCount}
          toCount={pagination.toCount}
          totalCount={pagination.totalCount}
          pageSize={pagination.pageSize}
          onNextPage={pagination.onNextPage}
          onPreviousPage={pagination.onPreviousPage}
          onPageSizeChange={pagination.onPageSizeChange}
          isNextDisabled={pagination.isNextDisabled}
          isPrevDisabled={pagination.isPrevDisabled}
          isLoading={loading}
          showPageSizeOptions={pagination.showPageSizeOptions}
        />
      )}
    </>
  );
};
