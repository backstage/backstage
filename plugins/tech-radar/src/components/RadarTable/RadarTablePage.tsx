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
import { Grid } from '@material-ui/core';
import React from 'react';
import useTechRadarLoader from '../../hooks/useTechRadarLoader';
import { mapToEntries } from '../../utils/processor';
import RadarEntryTable from './RadarTable';

const RadarTablePage = ({ id }: { id?: string }) => {
  const { loading, value: data } = useTechRadarLoader(id);
  const entries =
    data &&
    mapToEntries({
      ...data,
      rings: data.rings.map((e, i) => ({ ...e, index: i })),
    });
  return (
    <Grid container spacing={3} direction="row">
      <Grid item xs={12}>
        <RadarEntryTable loading={loading} entries={entries} />
      </Grid>
    </Grid>
  );
};

export default RadarTablePage;
