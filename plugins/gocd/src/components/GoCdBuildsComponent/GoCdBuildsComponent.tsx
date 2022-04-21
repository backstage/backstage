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
import React, { useState } from 'react';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  Content,
  ContentHeader,
  MissingAnnotationEmptyState,
  EmptyState,
  Page,
} from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { gocdApiRef } from '../../plugin';
import { GoCdBuildsTable } from '../GoCdBuildsTable/GoCdBuildsTable';
import { GoCdBuildsInsights } from '../GoCdBuildsInsights/GoCdBuildsInsights';
import { GoCdApiError, PipelineHistory } from '../../api/gocdApi.model';
import { Item, Select } from '../Select';

/**
 * Constant storing GoCD pipelines annotation.
 *
 * @public
 */
export const GOCD_PIPELINES_ANNOTATION = 'gocd.org/pipelines';

/**
 * Returns true if GoCD annotation is present in the given entity.
 *
 * @public
 */
export const isGoCdAvailable = (entity: Entity): boolean =>
  Boolean(entity.metadata.annotations?.[GOCD_PIPELINES_ANNOTATION]);

export const GoCdBuildsComponent = (): JSX.Element => {
  const { entity } = useEntity();
  const config = useApi(configApiRef);
  const rawPipelines: string[] | undefined = (
    entity.metadata.annotations?.[GOCD_PIPELINES_ANNOTATION] as
      | string
      | undefined
  )
    ?.split(',')
    .map(p => p.trim());
  const gocdApi = useApi(gocdApiRef);

  const [selectedPipeline, setSelectedPipeline] = useState<string>(
    rawPipelines ? rawPipelines[0] : '',
  );

  const {
    value: pipelineHistory,
    loading,
    error,
  } = useAsync(async (): Promise<PipelineHistory | GoCdApiError> => {
    return await gocdApi.getPipelineHistory(selectedPipeline);
  }, [selectedPipeline]);

  const onSelectedPipelineChanged = (pipeline: string) => {
    setSelectedPipeline(pipeline);
  };

  const getSelectionItems = (pipelines: string[]): Item[] => {
    return pipelines.map(p => ({ label: p, value: p }));
  };

  function isError(
    apiResult: PipelineHistory | GoCdApiError | undefined,
  ): apiResult is GoCdApiError {
    return (apiResult as GoCdApiError)?.message !== undefined;
  }

  if (!rawPipelines) {
    return (
      <MissingAnnotationEmptyState annotation={GOCD_PIPELINES_ANNOTATION} />
    );
  }

  if (isError(pipelineHistory)) {
    return (
      <EmptyState
        title="GoCD pipelines"
        description={`Could not fetch pipelines defined for entity ${entity.metadata.name}. Error: ${pipelineHistory.message}`}
        missing="content"
      />
    );
  }

  if (!loading && !pipelineHistory) {
    return (
      <EmptyState
        title="GoCD pipelines"
        description={`We could not find pipelines defined for entity ${entity.metadata.name}.`}
        missing="data"
      />
    );
  }

  return (
    <Page themeId="tool">
      <Content noPadding>
        <ContentHeader title={entity.metadata.name}>
          <Select
            value={selectedPipeline}
            onChange={pipeline => onSelectedPipelineChanged(pipeline)}
            label="Pipeline"
            items={getSelectionItems(rawPipelines)}
          />
        </ContentHeader>
        <GoCdBuildsInsights
          pipelineHistory={pipelineHistory}
          loading={loading}
          error={error}
        />
        <GoCdBuildsTable
          goCdBaseUrl={config.getString('gocd.baseUrl')}
          pipelineHistory={pipelineHistory}
          loading={loading}
          error={error}
        />
      </Content>
    </Page>
  );
};
