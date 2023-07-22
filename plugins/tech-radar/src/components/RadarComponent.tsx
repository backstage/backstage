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

import {
  ContentHeader,
  Link,
  Progress,
  SupportButton,
} from '@backstage/core-components';
import { Grid, Input, makeStyles, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { RadarEntry } from '../api';
import Radar from '../components/Radar';
import useTechRadarLoader from '../hooks/useTechRadarLoader';
import { mapToEntries, matchFilter } from '../utils/processor';

/**
 * Properties of {@link TechRadarComponent}
 *
 * @public
 */
export interface TechRadarComponentProps {
  /**
   * ID of this Tech Radar
   *
   * @remarks
   *
   * Used when there are multiple Tech Radars and passed to {@link TechRadarApi.load}
   */
  id?: string;
  /**
   * Width of Tech Radar
   */
  width: number;
  /**
   * Height of Tech Radar
   */
  height: number;
  /**
   * Custom React props to the `<svg>` element created for Tech Radar
   */
  svgProps?: object;
  /**
   * Text to filter {@link RadarEntry} inside Tech Radar
   */
  searchText?: string;

  pageTitle?: string;
}

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: 'scroll',
  },
}));

/**
 * Main React component of Tech Radar
 *
 * @remarks
 *
 * For advanced use cases. Typically, you want to use {@link TechRadarPage}
 *
 * @public
 */
export function RadarComponent(props: TechRadarComponentProps) {
  const { id, pageTitle = 'Company Radar' } = props;
  const classes = useStyles();
  const [searchText, setSearchText] = React.useState('');

  const { loading, error, value: data } = useTechRadarLoader(id);
  const dataEntries = data && data.entries.filter(matchFilter(searchText));
  const numberOfMissingElements =
    (data &&
      dataEntries?.filter(
        entry =>
          data.rings.find(ring => entry.timeline[0].ringId === ring.id)?.hidden,
      ).length) ||
    0;
  return (
    <>
      <ContentHeader title={pageTitle}>
        <Input
          id="tech-radar-filter"
          type="search"
          placeholder="Filter"
          onChange={e => setSearchText(e.target.value)}
        />
        <SupportButton>
          <Typography paragraph>
            This is used for visualizing the official guidelines of different
            areas of software development such as languages, frameworks,
            infrastructure and processes. You can find an explanation for the
            radar at{' '}
            <Link to="https://opensource.zalando.com/tech-radar/">
              Zalando Tech Radar
            </Link>
            .
          </Typography>
        </SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="row">
        {numberOfMissingElements > 0 && (
          <Grid item xs={12}>
            <Alert severity="warning">
              {numberOfMissingElements} element
              {numberOfMissingElements === 1 ? '' : 's'} hidden from the below
              radar. Please check the <Link to="search">search view</Link>.
            </Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <div className={classes.overflowXScroll}>
            {loading && <Progress />}
            {!loading && !error && data && dataEntries && (
              <Radar
                {...props}
                rings={data.rings.filter(e => !e.hidden)}
                quadrants={data.quadrants}
                entries={mapToEntries({
                  ...data,
                  entries: dataEntries.filter(
                    entry =>
                      !data.rings.find(
                        ring => entry.timeline[0].ringId === ring.id,
                      )?.hidden,
                  ),
                })}
              />
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
}
