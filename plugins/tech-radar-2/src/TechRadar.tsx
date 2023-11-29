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
import React, { FC } from 'react';

import { makeStyles, withStyles, Grid, Typography } from '@material-ui/core';

import { InfoCard } from '@backstage/core-components';

import Radar from './components/TechRadar';
import { Category, EntryConfig, Lifecycle } from './types';

export interface Props {
  entries: EntryConfig[];
}

const useStyles = makeStyles(theme => ({
  radarInfo: {
    marginTop: theme.spacing(5),
  },
  h5: {
    marginBottom: theme.spacing(2),
  },
  body1: {
    fontSize: 14,
    lineHeight: 1.3,
    marginBottom: theme.spacing(1),
  },
}));

const TechRadarWrapper = withStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    overflow: 'auto',
  },
}))(InfoCard);

const TechRadarInfoCard = withStyles(theme => ({
  root: {
    background: 'transparent',
    boxShadow: 'none',
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
  },
}))(InfoCard);

const TechRadar: FC<Props> = ({ entries }) => {
  const classes = useStyles();
  const typographyClasses = { h5: classes.h5, body1: classes.body1 };

  return (
    <>
      <TechRadarWrapper>
        <Radar
          svgProps={{ 'data-testid': 'tech-radar-svg' }}
          ringConfig={[
            { id: Lifecycle.Use, name: 'Use', color: '#1db954' },
            { id: Lifecycle.Trial, name: 'Trial', color: '#2e77d0' },
            { id: Lifecycle.Assess, name: 'Assess', color: '#ff6437' },
            { id: Lifecycle.Hold, name: 'Hold', color: '#cd1a2b' },
          ]}
          quadrantConfig={[
            { id: Category.Languages, name: 'Languages' },
            { id: Category.Techniques, name: 'Techniques' },
            { id: Category.Frameworks, name: 'Frameworks' },
            { id: Category.Infrastructure, name: 'Infrastructure' },
          ]}
          entryConfig={entries.map(entry => ({
            ...entry,
            url: `/docs/tech-radar${entry.path}`,
          }))}
        />
      </TechRadarWrapper>

      <Grid container className={classes.radarInfo}>
        <Grid item xs={6}>
          <TechRadarInfoCard>
            <Typography classes={typographyClasses} variant="h5">
              The Tech Radar is a Tech Radar
            </Typography>
            <Typography classes={typographyClasses} variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. In hac
              habitasse platea dictumst vestibulum rhoncus est. Volutpat est
              velit egestas dui id ornare arcu. Ac tincidunt vitae semper quis
              lectus nulla at volutpat diam. Commodo odio aenean sed adipiscing.
              Penatibus et magnis dis parturient montes nascetur ridiculus.
              Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur
              vitae nunc. Aliquam vestibulum morbi blandit cursus risus at. Id
              aliquet lectus proin nibh nisl condimentum id venenatis. A erat
              nam at lectus urna duis. Lectus proin nibh nisl condimentum id.
              Eget duis at tellus at urna condimentum. Bibendum at varius vel
              pharetra vel. Turpis cursus in hac habitasse platea dictumst.
              Neque egestas congue quisque egestas diam. In fermentum et
              sollicitudin ac orci phasellus. In dictum non consectetur a erat
              nam.
            </Typography>
          </TechRadarInfoCard>
        </Grid>
        <Grid item xs={6}>
          <TechRadarInfoCard>
            <Typography classes={typographyClasses} variant="h5">
              The Tech Radar is a Tech Radar
            </Typography>
            <Typography classes={typographyClasses} variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. In hac
              habitasse platea dictumst vestibulum rhoncus est. Volutpat est
              velit egestas dui id ornare arcu. Ac tincidunt vitae semper quis
              lectus nulla at volutpat diam. Commodo odio aenean sed adipiscing.
              Penatibus et magnis dis parturient montes nascetur ridiculus.
              Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur
              vitae nunc. Aliquam vestibulum morbi blandit cursus risus at. Id
              aliquet lectus proin nibh nisl condimentum id venenatis. A erat
              nam at lectus urna duis. Lectus proin nibh nisl condimentum id.
              Eget duis at tellus at urna condimentum. Bibendum at varius vel
              pharetra vel. Turpis cursus in hac habitasse platea dictumst.
              Neque egestas congue quisque egestas diam. In fermentum et
              sollicitudin ac orci phasellus. In dictum non consectetur a erat
              nam.
            </Typography>
          </TechRadarInfoCard>
        </Grid>
        <Grid item xs={6}>
          <TechRadarInfoCard>
            <Typography classes={typographyClasses} variant="h5">
              The Tech Radar is a Tech Radar
            </Typography>
            <Typography classes={typographyClasses} variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. In hac
              habitasse platea dictumst vestibulum rhoncus est. Volutpat est
              velit egestas dui id ornare arcu. Ac tincidunt vitae semper quis
              lectus nulla at volutpat diam. Commodo odio aenean sed adipiscing.
              Penatibus et magnis dis parturient montes nascetur ridiculus.
              Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur
              vitae nunc. Aliquam vestibulum morbi blandit cursus risus at. Id
              aliquet lectus proin nibh nisl condimentum id venenatis. A erat
              nam at lectus urna duis. Lectus proin nibh nisl condimentum id.
              Eget duis at tellus at urna condimentum. Bibendum at varius vel
              pharetra vel. Turpis cursus in hac habitasse platea dictumst.
              Neque egestas congue quisque egestas diam. In fermentum et
              sollicitudin ac orci phasellus. In dictum non consectetur a erat
              nam.
            </Typography>
          </TechRadarInfoCard>
        </Grid>
        <Grid item xs={6}>
          <TechRadarInfoCard>
            <Typography classes={typographyClasses} variant="h5">
              The Tech Radar is a Tech Radar
            </Typography>
            <Typography classes={typographyClasses} variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. In hac
              habitasse platea dictumst vestibulum rhoncus est. Volutpat est
              velit egestas dui id ornare arcu. Ac tincidunt vitae semper quis
              lectus nulla at volutpat diam. Commodo odio aenean sed adipiscing.
              Penatibus et magnis dis parturient montes nascetur ridiculus.
              Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur
              vitae nunc. Aliquam vestibulum morbi blandit cursus risus at. Id
              aliquet lectus proin nibh nisl condimentum id venenatis. A erat
              nam at lectus urna duis. Lectus proin nibh nisl condimentum id.
              Eget duis at tellus at urna condimentum. Bibendum at varius vel
              pharetra vel. Turpis cursus in hac habitasse platea dictumst.
              Neque egestas congue quisque egestas diam. In fermentum et
              sollicitudin ac orci phasellus. In dictum non consectetur a erat
              nam.
            </Typography>
          </TechRadarInfoCard>
        </Grid>
      </Grid>
    </>
  );
};

export default TechRadar;
