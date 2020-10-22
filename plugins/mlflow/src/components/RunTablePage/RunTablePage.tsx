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
import React, { useState } from 'react';
import { useAsync } from 'react-use';
import { Grid, TextField, Button, FormControl } from '@material-ui/core';
import { Progress } from '@backstage/core';
import { Run } from '../../MLFlowClient';
import { mlFlowClient } from '../../index';
import { RunTable } from '../ExperimentPage/RunTable';
import { RunTrend } from './RunTrend';

type RunTablePageProps = {
  experimentId: string;
  showTrend: boolean;
};

export const RunTablePage = ({
  experimentId,
  showTrend,
}: RunTablePageProps) => {
  const [searchQueryBox, setSearchQueryBox] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>();

  const { value: runs, loading } = useAsync(async (): Promise<Run[]> => {
    return mlFlowClient.searchRuns([experimentId], searchQuery);
  }, [searchQuery]);

  if (loading) {
    return <Progress />;
  }

  function handleSearchSubmit() {
    setSearchQuery(searchQueryBox);
  }

  function handleClearSearchSubmit() {
    setSearchQueryBox('');
    setSearchQuery('');
  }

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Grid container direction="row" spacing={3} alignItems="center">
          <Grid item xs={12} md={9}>
            <FormControl fullWidth>
              <TextField
                label="Custom MLFlow search query"
                helperText="Filters in the table below operate on the results of this query"
                name="query-input"
                value={searchQueryBox}
                variant="outlined"
                onChange={e => setSearchQueryBox(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} md={1}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              onClick={handleSearchSubmit}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={6} md={2}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              onClick={handleClearSearchSubmit}
            >
              Clear Search
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        {runs &&
          (showTrend ? <RunTrend runs={runs} /> : <RunTable runs={runs} />)}
      </Grid>
    </Grid>
  );
};
