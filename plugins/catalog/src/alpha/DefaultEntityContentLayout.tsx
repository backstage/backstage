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

import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { EntityContentLayoutProps } from '@backstage/plugin-catalog-react/alpha';
import { EntitySwitch } from '../components/EntitySwitch';
import {
  EntityOrphanWarning,
  isOrphan,
} from '../components/EntityOrphanWarning';
import {
  EntityRelationWarning,
  hasRelationWarnings,
} from '../components/EntityRelationWarning';
import {
  EntityProcessingErrorsPanel,
  hasCatalogProcessingErrors,
} from '../components/EntityProcessingErrorsPanel';
import { HorizontalScrollGrid } from '@backstage/core-components';

const useStyles = makeStyles<
  Theme,
  { infoCards: boolean; summaryCards: boolean; contentCards: boolean }
>(theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column nowrap',
    gap: theme.spacing(3),
  },
  contentArea: {
    display: 'flex',
    flexFlow: 'column',
    gap: theme.spacing(3),
    alignItems: 'stretch',
    minWidth: 0,
  },
  infoArea: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    gap: theme.spacing(3),
    minWidth: 0,
  },
  summaryArea: {
    margin: theme.spacing(1.5), // To counteract MUI negative grid margin
  },
  summaryCard: {
    flex: '0 0 auto',
    '& + &': {
      marginLeft: theme.spacing(3),
    },
  },
  [theme.breakpoints.up('md')]: {
    root: {
      display: 'grid',
      gap: 0,
      gridTemplateAreas: ({ summaryCards }) => `
        "${summaryCards ? 'summary' : 'content'} info"
        "content info"
      `,
      gridTemplateColumns: ({ infoCards }) => (infoCards ? '2fr 1fr' : '1fr'),
      alignItems: 'start',
    },
    infoArea: {
      gridArea: 'info',
      position: 'sticky',
      top: theme.spacing(3),
      marginLeft: theme.spacing(3),
    },
    contentArea: {
      gridArea: 'content',
    },
    summaryArea: {
      gridArea: 'summary',
      marginBottom: theme.spacing(3),
    },
  },
}));

const entityWarningContent = (
  <>
    <EntitySwitch>
      <EntitySwitch.Case if={isOrphan}>
        <Grid item xs={12}>
          <EntityOrphanWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasRelationWarnings}>
        <Grid item xs={12}>
          <EntityRelationWarning />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>

    <EntitySwitch>
      <EntitySwitch.Case if={hasCatalogProcessingErrors}>
        <Grid item xs={12}>
          <EntityProcessingErrorsPanel />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </>
);

export function DefaultEntityContentLayout(props: EntityContentLayoutProps) {
  const { cards } = props;

  const infoCards = cards.filter(card => card.type === 'info');
  const summaryCards = cards.filter(card => card.type === 'summary');
  const contentCards = cards.filter(
    card => !card.type || card.type === 'content',
  );

  const classes = useStyles({
    infoCards: !!infoCards.length,
    summaryCards: !!summaryCards.length,
    contentCards: !!contentCards.length,
  });

  return (
    <>
      {entityWarningContent}
      <div className={classes.root}>
        {infoCards.length > 0 ? (
          <div className={classes.infoArea}>
            {infoCards.map(card => card.element)}
          </div>
        ) : null}
        {summaryCards.length > 0 ? (
          <div className={classes.summaryArea}>
            <HorizontalScrollGrid>
              {summaryCards.map(card => (
                <div className={classes.summaryCard}>{card.element}</div>
              ))}
            </HorizontalScrollGrid>
          </div>
        ) : null}
        {contentCards.length > 0 ? (
          <div className={classes.contentArea}>
            {contentCards.map(card => card.element)}
          </div>
        ) : null}
      </div>
    </>
  );
}
