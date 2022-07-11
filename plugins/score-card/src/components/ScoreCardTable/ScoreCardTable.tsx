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
import React, { useEffect } from 'react';
import { Table, TableColumn, Progress, Link } from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { scoreToColorConverter } from '../../helpers/scoreToColorConverter';
import { Chip } from '@material-ui/core';
import { getWarningPanel } from '../../helpers/getWarningPanel';
import { scoringDataApiRef } from '../../api';
import { SystemScoreExtended } from '../../api/types';
import { EntityRefLink } from '@backstage/plugin-catalog-react';

const useScoringAllDataLoader = () => {
  const errorApi = useApi(errorApiRef);
  const scorigDataApi = useApi(scoringDataApiRef);

  const { error, value, loading } = useAsync(
    async () => scorigDataApi.getAllScores(),
    [scorigDataApi],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  return { loading, value, error };
};

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
          </Link> // NOTE: we can't use EntityRefLink as it does not yet support navigating to "/score" (or other tab) yet
        ) : (
          <>{systemScore.systemEntityName}</>
        ),
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

  // in case we have less then 10 systems let's show at least 10 rows
  const minDefaultPageSizeOption = scores.length >= 10 ? scores.length : 10;
  // so in case we have less then 100 systems we want to see them all in one page after load
  const maxDefaultPageSizeOption =
    scores.length < 100 ? minDefaultPageSizeOption : 100;
  // so now we are in a situation, when
  // count(systems) | minDefaultPageSizeOption | maxDefaultPageSizeOption | defaultPageSizeOption
  //   0 |  10 |  10 |  10
  //   5 |  10 |  10 |  10
  //  10 |  10 |  10 |  10
  //  50 |  50 |  50 |  50
  // 100 | 100 | 100 | 100
  // 150 | 150 | 100 | 100
  const defaultPageSizeOption =
    minDefaultPageSizeOption > maxDefaultPageSizeOption
      ? maxDefaultPageSizeOption
      : minDefaultPageSizeOption;

  return (
    <div data-testid="score-board-table">
      <Table<SystemScoreExtended>
        title="System scores overview"
        options={{
          search: true,
          paging: true,
          padding: 'dense',
          pageSize: defaultPageSizeOption,
          pageSizeOptions: [defaultPageSizeOption, 20, 50, 100, 200],
        }}
        columns={columns}
        data={scores}
      />
    </div>
  );
};

export const ScoreCardTable = () => {
  const { loading, error, value: data } = useScoringAllDataLoader();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return getWarningPanel(error);
  }

  return <ScoreTable scores={data || []} />;
};
