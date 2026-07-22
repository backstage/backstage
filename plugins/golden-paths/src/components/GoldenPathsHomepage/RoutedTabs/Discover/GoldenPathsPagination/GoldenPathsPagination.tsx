/*
 * Copyright 2026 The Backstage Authors
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
import { MouseEvent } from 'react';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { TablePagination } from '@material-ui/core';

export const GoldenPathsPagination = () => {
  const {
    limit,
    totalItems,
    setLimit,
    setOffset,
    offset: initialOffset,
  } = useEntityList();
  const offset = initialOffset || 0;
  const currentPage = offset / limit;

  if (!setOffset) return null;

  const changePage = (
    _event: MouseEvent<HTMLButtonElement> | null,
    nextPage: number,
  ) => {
    if (nextPage > currentPage) {
      setOffset(offset + limit);
    } else {
      setOffset(offset - limit);
    }
  };

  return (
    <TablePagination
      component="div"
      count={totalItems || -1}
      onPageChange={changePage}
      rowsPerPage={limit}
      page={currentPage}
      rowsPerPageOptions={[12, 24]}
      labelRowsPerPage="Golden Paths per page:"
      onRowsPerPageChange={event => {
        setLimit(Number(event.target.value));
        setOffset(0);
      }}
    />
  );
};
