/*
 * Copyright 2020 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Chip, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useAsync } from 'react-use';

import {
  EmptyState,
  InfoCard,
  InfoCardVariants,
  Progress,
  Table,
  TableColumn,
} from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { SystemScore } from '../../types/SystemScore';
import { scoreToColorConverter } from '../../helpers/scoreToColorConverter';
import { extendSystemScore } from '../../helpers/extendSystemScore';
import { getWarningPanel } from '../../helpers/getWarningPanel';
import {
  getScoreTableEntries,
  SystemScoreTableEntry,
} from './helpers/getScoreTableEntries';
import { areaColumn } from './columns/areaColumn';
import { detailsColumn } from './columns/detailsColumn';
import { scorePercentColumn } from './columns/scorePercentColumn';
import { titleColumn } from './columns/titleColumn';
import { getReviewerLink } from './sub-components/getReviewerLink';

// lets prepare some styles
const useStyles = makeStyles(theme => ({
  badgeLabel: {
    color: theme.palette.common.white,
  },
  header: {
    padding: theme.spacing(2, 2, 2, 2.5),
  },
  action: {
    margin: 0,
  },
  disabled: {
    backgroundColor: theme.palette.background.default,
  },
}));

export const ScoreCard = ({
  variant = 'gridItem',
}: {
  entity?: Entity;
  variant?: InfoCardVariants;
}) => {
  const { entity } = useEntity();
  const systemName = entity.metadata.name;

  // let's load the entity data from url defined in config
  const configApi = useApi(configApiRef);
  const jsonDataUrl =
    configApi.getOptionalString('scorecards.jsonDataUrl') ??
    'https://unknown-url-please-configure';
  const {
    loading: loading,
    error: error,
    value: value,
  } = useAsync(async () => {
    const urlWithData = `${jsonDataUrl}${systemName}.json`;
    // DEBUG: console.log(`Fetching data from ${urlWithData}`);
    const result: SystemScore = await fetch(urlWithData).then(res => {
      switch (res.status) {
        case 404:
          return null;
        case 200:
          return res.json();
        default:
          throw new Error(`error from server (code ${res.status})`);
      }
    });
    if (!result) {
      return null;
    }
    return extendSystemScore(result, undefined);
  });

  const classes = useStyles();

  // let's prepare the "chip" used in the up-right card corner
  let gateLabel = 'Not computed';
  const gateStyle = {
    margin: 0,
    backgroundColor: scoreToColorConverter(value?.scoreSuccess),
  };
  if (value?.scorePercent || value?.scorePercent === 0) {
    gateLabel = `Total score: ${value?.scorePercent} %`;
  }
  const qualityBadge = !loading && <Chip label={gateLabel} style={gateStyle} />;

  // let's define the main table columns
  const columns: TableColumn<SystemScoreTableEntry>[] = [
    areaColumn(value),
    titleColumn,
    detailsColumn,
    scorePercentColumn,
  ];

  const allEntries = getScoreTableEntries(value);

  return (
    <InfoCard
      title={`Score Card for ${systemName}`}
      variant={variant}
      headerProps={{
        action: qualityBadge,
        classes: {
          root: classes.header,
          action: classes.action,
        },
      }}
    >
      {loading && <Progress />}

      {error && getWarningPanel(error)}

      {!loading && !value && (
        <EmptyState
          missing="info"
          title="No information to display"
          description={`There is no data available for '${systemName}'.`}
        />
      )}

      {!loading && value && (
        <>
          <Grid
            item
            container
            direction="column"
            justify="space-between"
            alignItems="stretch"
            style={{ height: '100%' }}
            spacing={0}
          >
            <Table<SystemScoreTableEntry>
              title="Score of each requirement"
              options={{
                search: true,
                paging: false,
                grouping: true,
                padding: 'dense',
              }}
              columns={columns}
              data={allEntries}
              components={{
                Groupbar: () => null, // we do not want to display possibility to change grouping
              }}
            />

            {getReviewerLink(value)}
          </Grid>
        </>
      )}
    </InfoCard>
  );
};
