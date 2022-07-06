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
import React from 'react';
import { Table, TableColumn, Progress, Link } from '@backstage/core-components';
import { useAsync } from 'react-use';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { SystemScore } from '../../types/SystemScore';
import { scoreToColorConverter } from '../../helpers/scoreToColorConverter';
import { Chip } from '@material-ui/core';
import { catalogApiRef, EntityRefLink } from '@backstage/plugin-catalog-react';
import { SystemScoreExtended } from '../../types/SystemScoreExtended';
import { extendSystemScore } from '../../helpers/extendSystemScore';
import { getWarningPanel } from '../../helpers/getWarningPanel';

type ScoreTableProps = {
  scores: SystemScoreExtended[];
};

export const ScoreTable = ({ scores }: ScoreTableProps) => {
  const columns: TableColumn<SystemScoreExtended>[] = [
    {
      title: 'Name',
      field: 'systemEntityName',
      render: systemScore =>
        systemScore.catalogEntityName ? (
          <Link
            to={`/catalog/${systemScore.catalogEntityName.namespace}/${systemScore.catalogEntityName.kind}/${systemScore.catalogEntityName.name}/score`}
            data-id={systemScore.systemEntityName}
          >
            {systemScore.systemEntityName}
          </Link>
        ) : (
          <>{systemScore.systemEntityName}</>
        ),
      // this would be better but it cant link to "/score" <EntityRefLink entityRef={{
      //   kind: 'System',
      //   namespace: 'default',
      //   name: systemScore.systemEntityName,
      // }} defaultKind={'System'} />
    },
    {
      title: 'Owner',
      field: 'owner.name',
      render: systemScore =>
        systemScore.owner ? (
          <>
            <EntityRefLink entityRef={systemScore.owner}>
              {systemScore.owner.name}
            </EntityRefLink>
          </>
        ) : null,
    },
    {
      title: 'Reviewer',
      field: 'scoringReviewer',
      render: systemScore =>
        systemScore.reviewer ? (
          <>
            <EntityRefLink entityRef={systemScore.reviewer}>
              {systemScore.reviewer?.name}
            </EntityRefLink>
          </>
        ) : null,
    },
    {
      title: 'Date',
      field: 'scoringReviewDate',
      render: systemScore =>
        systemScore.reviewDate ? (
          <>{systemScore.reviewDate.toLocaleDateString()}</>
        ) : null,
    },
  ];
  scores
    .flatMap(s => {
      return s.areaScores ?? [];
    })
    .reduce<string[]>((areas, area) => {
      if (!area || !area.title || areas.findIndex(x => x === area.title) !== -1)
        return areas;
      areas.push(area.title);
      columns.push({
        title: area.title,
        field: 'n/a',
        customSort: (d1, d2) => {
          const d1ScoreEntry = d1?.areaScores
            ? d1.areaScores.find(a => a.title === area.title)?.scorePercent
            : undefined;
          const d2ScoreEntry = d2?.areaScores
            ? d2.areaScores.find(a => a.title === area.title)?.scorePercent
            : undefined;
          if (!d1ScoreEntry || d1ScoreEntry < (d2ScoreEntry ?? 0)) return -1;
          if (!d2ScoreEntry || d2ScoreEntry < d1ScoreEntry) return 1;
          return 0;
        },
        render: systemScoreEntry => {
          const currentScoreEntry = systemScoreEntry?.areaScores
            ? systemScoreEntry.areaScores.find(a => a.title === area.title)
            : undefined;
          const chipStyle: React.CSSProperties = {
            margin: 0,
            backgroundColor: scoreToColorConverter(
              currentScoreEntry?.scoreSuccess,
            ),
            minWidth: '4rem',
          };
          return typeof currentScoreEntry?.scorePercent !== 'undefined' ? (
            <Chip
              label={`${currentScoreEntry?.scorePercent} %`}
              style={chipStyle}
            />
          ) : null;
        },
      });
      return areas;
    }, []);

  columns.push({
    title: 'Total',
    align: 'right',
    field: 'scorePercent',
    render: systemScoreEntry => {
      const chipStyle: React.CSSProperties = {
        margin: 0,
        backgroundColor: scoreToColorConverter(systemScoreEntry?.scoreSuccess),
        float: 'right',
        minWidth: '4rem',
      };
      return typeof systemScoreEntry.scorePercent !== 'undefined' ? (
        <Chip label={`${systemScoreEntry.scorePercent} %`} style={chipStyle} />
      ) : null;
    },
  });

  return (
    <Table<SystemScoreExtended>
      title="System scores overview"
      options={{
        search: true,
        paging: true,
        padding: 'dense',
        pageSize: scores.length,
        pageSizeOptions: [20, 50, 100, 200],
      }}
      columns={columns}
      data={scores}
    />
  );
};

export const ScoreCardTable = () => {
  const configApi = useApi(configApiRef);
  const catalogApi = useApi(catalogApiRef);
  const jsonDataUrl =
    configApi.getOptionalString('scorecards.jsonDataUrl') ??
    'https://unknown-url-please-configure';

  const { value, loading, error } = useAsync(async (): Promise<
    SystemScoreExtended[]
  > => {
    const urlWithData = `${jsonDataUrl}all.json`;
    const result: SystemScore[] = await fetch(urlWithData).then(res => {
      switch (res.status) {
        case 404:
          return null;
        case 200:
          return res.json();
        default:
          throw new Error(`error from server (code ${res.status})`);
      }
    });
    const entities = await catalogApi.getEntities({
      filter: { kind: ['System'] },
      fields: ['kind', 'metadata.name', 'spec.owner', 'relations'],
    });
    /* TODO cache
    const cacheKey = `userProjects-${group ?? 'all'}`;
    const cachedProjects: UserProjects = JSON.parse(
      localStorage.getItem(cacheKey) || '{}',
    );
    localStorage.setItem(cacheKey, JSON.stringify(newCachedProjects));
    */
    const systems = entities.items;
    return result.map<SystemScoreExtended>(score => {
      return extendSystemScore(score, systems);
    });
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return getWarningPanel(error);
  }

  return <ScoreTable scores={value || []} />;
};
