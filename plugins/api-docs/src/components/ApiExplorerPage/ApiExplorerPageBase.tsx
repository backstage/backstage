/*
 * Copyright 2020 Spotify AB
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

import React from 'react';
import {
  Content,
  ContentHeader,
  SupportButton,
  TableProps,
  TableState,
  useApi,
  useRouteRef,
  useQueryParamState,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useAsync } from 'react-use';
import { ApiExplorerLayout } from './ApiExplorerLayout';
import { getRows, ApiTableError } from '../ApiExplorerTable/ApiExplorerTable';
import { createComponentRouteRef } from '../../routes';

type BaseTableProps = Partial<TableProps>;

export interface BaseProps {
  includeRegisterButton: boolean;
  showSupportButton: boolean;
  TableComponent: React.ComponentType<BaseTableProps>;
}

export const ApiExplorerPageBase = (baseProps: BaseProps) => {
  const createComponentLink = useRouteRef(createComponentRouteRef);
  const catalogApi = useApi(catalogApiRef);
  const [queryParamState, setQueryParamState] = useQueryParamState<TableState>(
    'apiTable',
  );

  const { loading, error, value: catalogResponse } = useAsync(() => {
    return catalogApi.getEntities({ filter: { kind: 'API' } });
  }, [catalogApi]);
  const {
    includeRegisterButton = true,
    showSupportButton = true,
    TableComponent,
  } = baseProps;

  const entities = catalogResponse?.items ?? [];
  const rows = getRows(entities);

  return (
    <ApiExplorerLayout>
      <Content>
        <ContentHeader title="">
          {includeRegisterButton && createComponentLink && (
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to={createComponentLink()}
            >
              Register Existing API
            </Button>
          )}
        </ContentHeader>

        {showSupportButton && <SupportButton>All your APIs</SupportButton>}

        {error && <ApiTableError error={error} />}

        {!error && TableComponent && (
          <TableComponent
            isLoading={loading}
            data={rows}
            options={{
              paging: false,
              actionsColumnIndex: -1,
              loadingType: 'linear',
              padding: 'dense',
              showEmptyDataSourceMessage: !loading,
            }}
            initialState={queryParamState}
            onStateChange={setQueryParamState}
          />
        )}
      </Content>
    </ApiExplorerLayout>
  );
};
