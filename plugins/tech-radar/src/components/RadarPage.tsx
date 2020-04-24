/*
 * Copyright 2020 Spotify AB
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

import React, { useEffect, useState, FC } from 'react';
import { Grid } from '@material-ui/core';
import {
  Progress,
  Page,
  Header,
  Content,
  pageTheme,
  useApi,
  errorApiRef,
  ErrorApi,
} from '@backstage/core';
import Radar from '../components/Radar';
import { techRadarApiRef, TechRadar, TechRadarLoaderResponse } from '../api';

const useTechRadarLoader = (techRadarApi: TechRadar) => {
  const [state, setState] = useState<{
    loading: boolean;
    error?: Error;
    data?: TechRadarLoaderResponse;
  }>({
    loading: true,
    error: undefined,
    data: undefined,
  });

  useEffect(() => {
    techRadarApi
      .load()
      .then((payload: TechRadarLoaderResponse) => {
        setState({ loading: false, error: undefined, data: payload });
      })
      .catch((err: Error) => {
        setState({
          loading: false,
          error: err,
          data: undefined,
        });
      });
  }, []);

  return state;
};

const RadarPage: FC<{}> = () => {
  const errorApi = useApi<ErrorApi>(errorApiRef);
  const techRadarApi = useApi<TechRadar>(techRadarApiRef);
  const { loading, error, data } = useTechRadarLoader(techRadarApi);

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error && error.message]);

  return (
    <Page theme={pageTheme.home}>
      <Header
        title={techRadarApi.additionalOpts.title}
        subtitle={techRadarApi.additionalOpts.subtitle}
      />
      <Content>
        <Grid container spacing={3} direction="row">
          <Grid item xs={12} sm={6} md={4}>
            {loading && <Progress />}
            {!loading && !error && (
              <Radar
                width={techRadarApi.width}
                height={techRadarApi.height}
                svgProps={techRadarApi.additionalOpts.svgProps}
                rings={data!.rings}
                quadrants={data!.quadrants}
                entries={data!.entries}
              />
            )}
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default RadarPage;
