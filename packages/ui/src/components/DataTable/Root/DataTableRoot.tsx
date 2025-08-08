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

import { forwardRef, createContext, useContext } from 'react';
import clsx from 'clsx';
import { DataTableRootProps } from './types';
import { Table } from '@tanstack/react-table';

type DataTableContextType<TData> = {
  table: Table<TData>;
};

/** @public */
export const DataTableContext = createContext<DataTableContextType<any> | null>(
  null,
);

/** @public */
const DataTableRoot = forwardRef(
  <TData,>(
    props: DataTableRootProps<TData>,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const { className, table, ...rest } = props;

    return (
      <DataTableContext.Provider value={{ table }}>
        <div ref={ref} className={clsx('bui-DataTable', className)} {...rest} />
      </DataTableContext.Provider>
    );
  },
);

DataTableRoot.displayName = 'DataTableRoot';

export { DataTableRoot };

/** @public */
export function useDataTable<TData>() {
  const context = useContext(DataTableContext);
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableRoot');
  }
  return context as DataTableContextType<TData>;
}
