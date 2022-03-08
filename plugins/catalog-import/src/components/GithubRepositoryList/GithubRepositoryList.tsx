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

import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Checkbox,
  Grid,
  Typography,
} from '@material-ui/core';
import ForkIcon from '@material-ui/icons/CallSplit';
import { Progress } from '@backstage/core-components';
import { useGithubRepositories } from '../../hooks/useGithubRepositories';

type GithubRepositoryListProps = {
  host: string;
  org: string;
};

export const GithubRepositoryList = ({
  host,
  org,
}: GithubRepositoryListProps) => {
  const { loading, repositories } = useGithubRepositories({ host, org });

  if (loading) {
    return <Progress />;
  }

  return (
    <Grid container>
      {repositories.map((repo, index) => (
        <Grid item xs={8} key={index}>
          <Card raised>
            <CardActionArea onClick={() => 0}>
              <CardContent>
                <Grid container>
                  <Grid item xs={1}>
                    <Checkbox name={repo.name} />
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant="h5">
                      {repo.name}{' '}
                      {repo.fork && (
                        <ForkIcon style={{ verticalAlign: 'middle' }} />
                      )}
                    </Typography>
                    <Typography>{repo.description}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
