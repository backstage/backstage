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
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(theme => ({
  [theme.breakpoints.up('sm')]: {
    infoArea: {
      order: 1,
      position: 'sticky',
      top: -16,
      alignSelf: 'flex-start',
    },
    card: {
      alignSelf: 'stretch',
      '& > *': {
        height: '100%',
        minHeight: 400,
      },
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
  const classes = useStyles();

  const infoCards = cards.filter(card => card.type === 'info');
  const peekCards = cards.filter(card => card.type === 'peek');
  const fullCards = cards.filter(card => !card.type || card.type === 'full');
  return (
    <Grid container spacing={3}>
      {entityWarningContent}
      {infoCards.length > 0 ? (
        <Grid className={classes.infoArea} xs={12} md={4} item>
          <Grid container spacing={3}>
            {infoCards.map((card, index) => (
              <Grid key={index} xs={12} item>
                {card.element}
              </Grid>
            ))}
          </Grid>
        </Grid>
      ) : null}
      {peekCards.length > 0 || fullCards.length > 0 ? (
        <Grid xs={12} md={infoCards.length ? 8 : undefined} item>
          {peekCards.length > 0 ? (
            <Grid container spacing={3}>
              {peekCards.map((card, index) => (
                <Grid key={index} xs={12} md={4} item>
                  {card.element}
                </Grid>
              ))}
            </Grid>
          ) : null}
          {fullCards.length > 0 ? (
            <Grid container spacing={3}>
              {fullCards.map((card, index) => (
                <Grid key={index} xs={12} item>
                  {card.element}
                </Grid>
              ))}
            </Grid>
          ) : null}
        </Grid>
      ) : null}
    </Grid>
  );
}
