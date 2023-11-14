/*
 * Copyright 2023 The Backstage Authors
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
  EmptyState,
  Progress,
  ContentHeader,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';
import { codesceneApiRef } from '../../api/api';
import { Analysis } from '../../api/types';
import { CodeHealthKpisCard } from '../CodeHealthKpisCard/CodeHealthKpisCard';
import {
  getProjectAnnotation,
  CODESCENE_PROJECT_ANNOTATION,
  isCodeSceneAvailable,
} from '../../utils/commonUtil';
import { DateTime } from 'luxon';
import { MissingAnnotationEmptyState } from '@backstage/plugin-catalog-react';

export const CodeSceneEntityKPICard = () => {
  const { entity } = useEntity();
  const { projectId } = getProjectAnnotation(entity);
  const codesceneApi = useApi(codesceneApiRef);
  const config = useApi(configApiRef);
  const codesceneHost = config.getString('codescene.baseUrl');

  const {
    value: analysis,
    loading,
    error,
  } = useAsync(async (): Promise<Analysis> => {
    return await codesceneApi.fetchLatestAnalysis(projectId);
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  } else if (!analysis) {
    return (
      <EmptyState
        missing="content"
        title="CodeScene analysis"
        description={`No analysis found for project with id ${projectId}`}
      />
    );
  }

  return isCodeSceneAvailable(entity) ? (
    <Content>
      <ContentHeader title="CodeScene Dashboard">
        Last analyzed on{' '}
        {DateTime.fromISO(analysis.readable_analysis_time).toLocaleString(
          DateTime.DATETIME_MED,
        )}
      </ContentHeader>
      <CodeHealthKpisCard codesceneHost={codesceneHost} analysis={analysis} />
    </Content>
  ) : (
    <MissingAnnotationEmptyState annotation={CODESCENE_PROJECT_ANNOTATION} />
  );
};
