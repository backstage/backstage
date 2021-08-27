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
import React from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { allureApiRef } from '../../api';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  ALLURE_PROJECT_ID_ANNOTATION,
  isAllureReportAvailable,
  getAllureProjectId,
} from '../annotationHelpers';
import {
  MissingAnnotationEmptyState,
  Progress,
} from '@backstage/core-components';
import { useAsync } from 'react-use';
import { Entity } from '@backstage/catalog-model';

const AllureReport = (props: { entity: Entity }) => {
  const allureApi = useApi(allureApiRef);

  const allureProjectId = getAllureProjectId(props.entity);
  const { value, loading } = useAsync(async () => {
    const url = await allureApi.getReportUrl(allureProjectId);
    return url;
  });

  if (loading) {
    return <Progress />;
  }
  return (
    <iframe
      style={{
        display: 'table',
        width: '100%',
        height: '100%',
      }}
      title="Allure Report"
      src={value}
    />
  );
};

export const AllureReportComponent = () => {
  const { entity } = useEntity();
  const isReportAvailable = entity && isAllureReportAvailable(entity);

  if (isReportAvailable) return <AllureReport entity={entity} />;
  return (
    <MissingAnnotationEmptyState annotation={ALLURE_PROJECT_ID_ANNOTATION} />
  );
};
