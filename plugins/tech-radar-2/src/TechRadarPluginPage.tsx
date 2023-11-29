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
import {
  Content,
  ContentHeader,
  Header,
  Page,
  Progress,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import React, { useEffect, useState } from 'react';
import TechRadar from './TechRadar';
import { Entry } from './types';
import sampleData from './sample-data.json';

type RadarManifestLoading = boolean;
type RadarManifestError = string | null;
type RadarManifestEntries = Entry[] | null;
type RadarManifestResponse = [
  RadarManifestLoading,
  RadarManifestError,
  RadarManifestEntries,
];

interface RadarManifestState {
  loading: RadarManifestLoading;
  error: RadarManifestError;
  entries: RadarManifestEntries;
}

const useRadarManifestFromTechDocs = (): RadarManifestResponse => {
  const [state, setState] = useState<RadarManifestState>({
    loading: true,
    error: null,
    entries: null,
  });

  useEffect(() => {
    // TODO: This was a fetch, but should be a TechRadar API call instead
    Promise.resolve(sampleData as unknown as { [key: string]: Entry })
      .then(json =>
        Object.entries(json).reduce(
          (array, [path, obj]) => array.concat([{ ...obj, path }]),
          [] as Entry[],
        ),
      )
      .then(entries =>
        entries.sort(
          (a: Entry, b: Entry) => (a.ordinal || 0) - (b.ordinal || 0),
        ),
      )
      .then(entries => setState({ loading: false, error: null, entries }))
      .catch(err =>
        setState({ loading: false, error: err.message, entries: null }),
      );
  }, []);

  return [state.loading, state.error, state.entries];
};

export const RadarPage = () => {
  const [loading, err, entries] = useRadarManifestFromTechDocs();

  return (
    <Page themeId="home">
      <Header
        title="Tech Radar"
        subtitle="A visual, concise summary of technologies in use at Spotify"
      />
      <Content>
        <ContentHeader title="Tech Radar" />
        <Grid item xs={12}>
          {loading && <Progress />}
          {!loading && err && <Alert severity="error">{err}</Alert>}
          {!loading && entries && <TechRadar entries={entries} />}
        </Grid>
      </Content>
    </Page>
  );
};
