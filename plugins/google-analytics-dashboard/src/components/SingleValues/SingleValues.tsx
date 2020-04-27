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

import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import SingleValueItem from 'components/SingleValueItem';

const SingleValues: FC<{}> = () => {
  const valueItems = [
    { title: 'Total Users', metric: 'ga:users' },
    { title: 'New Users', metric: 'ga:newUsers' },
    { title: 'Session per User', metric: 'ga:sessionsPerUser' },
  ];

  return (
    <Grid item container spacing={8}>
      {valueItems.map(item => (
        <SingleValueItem key={item.title} item={item} />
      ))}
    </Grid>
  );
};

export default SingleValues;
