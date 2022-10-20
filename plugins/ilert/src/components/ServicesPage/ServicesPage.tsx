/*
 * Copyright 2021 The Backstage Authors
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
import {
  Content,
  ContentHeader,
  ResponseErrorPanel,
  SupportButton,
} from '@backstage/core-components';
import React from 'react';
import { useServices } from '../../hooks/useServices';
import { MissingAuthorizationHeaderError } from '../Errors';
import { ServicesTable } from './ServicesTable';

export const ServicesPage = () => {
  const [
    { tableState, services, isLoading, error },
    { onChangePage, onChangeRowsPerPage, setIsLoading },
  ] = useServices(true);

  if (error) {
    if (error.name === 'AuthenticationError') {
      return (
        <Content>
          <MissingAuthorizationHeaderError />
        </Content>
      );
    }

    return (
      <Content>
        <ResponseErrorPanel error={error} />
      </Content>
    );
  }

  return (
    <Content>
      <ContentHeader title="Services">
        <SupportButton>
          This helps you to bring iLert into your developer portal.
        </SupportButton>
      </ContentHeader>
      <ServicesTable
        services={services}
        tableState={tableState}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </Content>
  );
};
