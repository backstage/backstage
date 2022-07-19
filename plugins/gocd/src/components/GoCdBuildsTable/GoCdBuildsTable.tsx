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
import { Entity, getEntitySourceLocation } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Alert } from '@material-ui/lab';
import { Button } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import {
  GoCdBuildResult,
  GoCdBuildResultStatus,
  toBuildResultStatus,
  PipelineHistory,
  Pipeline,
} from '../../api/gocdApi.model';
import { DateTime } from 'luxon';
import {
  Table,
  TableColumn,
  Link,
  SubvalueCell,
  StatusOK,
  StatusWarning,
  StatusAborted,
  StatusError,
  StatusRunning,
  StatusPending,
} from '@backstage/core-components';

type GoCdBuildsProps = {
  goCdBaseUrl: string;
  pipelineHistory: PipelineHistory | undefined;
  loading: boolean;
  error: Error | undefined;
};

const renderTrigger = (build: GoCdBuildResult): React.ReactNode => {
  const subvalue = (
    <>
      {build.pipeline}
      <br />
      {build.author}
    </>
  );
  return <SubvalueCell value={build.message} subvalue={subvalue} />;
};

const renderStages = (build: GoCdBuildResult): React.ReactNode => {
  return build.stages.map(s => {
    switch (s.status) {
      case GoCdBuildResultStatus.successful: {
        return (
          <>
            <StatusOK>{s.text}</StatusOK>
            <br />
            <br />
          </>
        );
      }
      case GoCdBuildResultStatus.error: {
        return (
          <>
            <StatusError>{s.text}</StatusError>
            <br />
            <br />
          </>
        );
      }
      case GoCdBuildResultStatus.running: {
        return (
          <>
            <StatusRunning>{s.text}</StatusRunning>
            <br />
            <br />
          </>
        );
      }
      case GoCdBuildResultStatus.aborted: {
        return (
          <>
            <StatusAborted>{s.text}</StatusAborted>
            <br />
            <br />
          </>
        );
      }
      case GoCdBuildResultStatus.pending: {
        return (
          <>
            <StatusPending>{s.text}</StatusPending>
            <br />
            <br />
          </>
        );
      }
      default: {
        return (
          <>
            <StatusWarning>{s.text}</StatusWarning>
            <br />
            <br />
          </>
        );
      }
    }
  });
};

const renderSource = (build: GoCdBuildResult): React.ReactNode => {
  return (
    <Button
      href={build.source}
      target="_blank"
      rel="noreferrer"
      startIcon={<GitHubIcon />}
    >
      {build.commitHash}
    </Button>
  );
};

const renderId = (
  goCdBaseUrl: string,
  build: GoCdBuildResult,
): React.ReactNode => {
  const goCdBuildUrl = `${goCdBaseUrl}/go/pipelines/value_stream_map/${build.buildSlug}`;
  return (
    <SubvalueCell
      value={
        <Link to={goCdBuildUrl} target="_blank" rel="noreferrer">
          {build.id}
        </Link>
      }
      subvalue={
        build.triggerTime &&
        DateTime.fromMillis(build.triggerTime).toLocaleString(
          DateTime.DATETIME_MED,
        )
      }
    />
  );
};

const renderError = (error: Error): JSX.Element => {
  return <Alert severity="error">{error.message}</Alert>;
};

const toBuildResults = (
  entity: Entity,
  builds: Pipeline[],
): GoCdBuildResult[] | undefined => {
  // TODO(julioz): What if not git 'type'?
  const entitySourceLocation =
    getEntitySourceLocation(entity).target.split('/tree')[0];
  return builds.map(build => ({
    id: build.counter,
    source: `${entitySourceLocation}/commit/${build.build_cause?.material_revisions[0]?.modifications[0].revision}`,
    stages: build.stages.map(s => ({
      status: toBuildResultStatus(s.status),
      text: s.name,
    })),
    buildSlug: `${build.name}/${build.counter}`,
    message:
      build.build_cause?.material_revisions[0]?.modifications[0].comment ?? '',
    pipeline: build.name,
    author:
      build.build_cause?.material_revisions[0]?.modifications[0].user_name,
    commitHash: build.label,
    triggerTime: build.scheduled_date,
  }));
};

export const GoCdBuildsTable = (props: GoCdBuildsProps): JSX.Element => {
  const { pipelineHistory, loading, error } = props;
  const { entity } = useEntity();
  const [, setSelectedSearchTerm] = useState<string>('');

  const columns: TableColumn<GoCdBuildResult>[] = [
    {
      title: 'ID',
      field: 'id',
      highlight: true,
      render: build => renderId(props.goCdBaseUrl, build),
    },
    {
      title: 'Trigger',
      customFilterAndSearch: (query, row: GoCdBuildResult) =>
        `${row.message} ${row.pipeline} ${row.author}`
          .toLocaleUpperCase('en-US')
          .includes(query.toLocaleUpperCase('en-US')),
      field: 'message',
      highlight: true,
      render: build => renderTrigger(build),
    },
    {
      title: 'Stages',
      field: 'status',
      render: build => renderStages(build),
    },
    {
      title: 'Source',
      field: 'source',
      render: build => renderSource(build),
    },
  ];

  return (
    <>
      {error && renderError(error)}
      {!error && (
        <Table
          title="GoCD builds"
          isLoading={loading}
          options={{
            search: true,
            searchAutoFocus: true,
            debounceInterval: 800,
            paging: true,
            padding: 'dense',
            pageSizeOptions: [5, 10, 20, 50],
            showFirstLastPageButtons: false,
            pageSize: 20,
          }}
          columns={columns}
          data={
            pipelineHistory
              ? toBuildResults(entity, pipelineHistory.pipelines) || []
              : []
          }
          onSearchChange={(searchTerm: string) =>
            setSelectedSearchTerm(searchTerm)
          }
        />
      )}
    </>
  );
};
