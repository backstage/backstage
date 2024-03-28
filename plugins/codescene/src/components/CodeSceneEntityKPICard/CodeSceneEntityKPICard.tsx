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
import { EmptyState, GaugeCard, InfoCard } from '@backstage/core-components';
import { configApiRef, useApi, useApp } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/esm/useAsync';
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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export const CodeSceneEntityKPICard = () => {
  const { entity } = useEntity();
  const { projectId } = getProjectAnnotation(entity);
  const codesceneApi = useApi(codesceneApiRef);
  const config = useApi(configApiRef);
  const codesceneHost = config.getString('codescene.baseUrl');
  const { Progress } = useApp().getComponents();

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

  const analysisPath = `${codesceneHost}/${projectId}/analyses/${analysis.id}`;
  const analysisLink = { title: 'Check the analysis', link: analysisPath };

  const analysisBody = (
    <>
      <Typography variant="body1">
        <b>Active authors</b>: {analysis.summary.active_authors_count}
      </Typography>
      <Typography variant="body1">
        <b>Total authors</b>: {analysis.summary.authors_count}
      </Typography>
      <Typography variant="body1">
        <b>Commits</b>: {analysis.summary.commits}
      </Typography>
    </>
  );

  return isCodeSceneAvailable(entity) ? (
    <>
      <Grid
        container
        spacing={1}
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={8}>
          <Grid style={{ height: '100%' }}>
            <CodeHealthKpisCard
              codesceneHost={codesceneHost}
              analysis={analysis}
            />
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <GaugeCard
                title="System Mastery"
                progress={analysis.high_level_metrics.system_mastery / 100}
              />
            </Grid>
            <Grid item xs={8} style={{ height: '100%' }}>
              <GaugeCard
                title="Current Score"
                progress={analysis.high_level_metrics.current_score / 10}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <InfoCard title="Analysis" deepLink={analysisLink}>
            {analysisBody}
          </InfoCard>
        </Grid>
      </Grid>
      <div style={{ textAlign: 'center' }}>
        <Typography variant="caption">{`Last analyzed on ${DateTime.fromISO(
          analysis.readable_analysis_time,
        ).toLocaleString(DateTime.DATETIME_MED)}`}</Typography>
      </div>
    </>
  ) : (
    <MissingAnnotationEmptyState annotation={CODESCENE_PROJECT_ANNOTATION} />
  );
};
