/*
 * Copyright 2022 The Backstage Authors
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
import { Content, EmptyState, InfoCard } from '@backstage/core-components';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import {
  useEntity,
  MissingAnnotationEmptyState,
} from '@backstage/plugin-catalog-react';
import {
  getProjectAnnotation,
  CODESCENE_PROJECT_ANNOTATION,
  isCodeSceneAvailable,
} from '../../utils/commonUtil';
import { useAnalyses } from '../../hooks/useAnalyses';
import { useApp } from '@backstage/core-plugin-api';
import { CodeSceneFileSummary } from '../CodeSceneProjectDetailsPage/CodeSceneProjectDetailsPage';

export const CodeSceneEntityFileSummary = () => {
  const { entity } = useEntity();
  const { projectId } = getProjectAnnotation(entity);
  const { Progress } = useApp().getComponents();
  const { analysis, loading, error } = useAnalyses(projectId);

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
    <InfoCard>
      <Content>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <CodeSceneFileSummary {...analysis} />
          </Grid>
        </Grid>
      </Content>
    </InfoCard>
  ) : (
    <MissingAnnotationEmptyState annotation={CODESCENE_PROJECT_ANNOTATION} />
  );
};
