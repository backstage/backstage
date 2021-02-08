/*
 * Copyright 2021 Spotify AB
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
import { DomainEntity } from '@backstage/catalog-model';
import { Grid } from '@material-ui/core';
import React from 'react';
import { DomainCard } from '.';

type DomainCardGridProps = {
  entities: DomainEntity[];
};

export const DomainCardGrid = ({ entities }: DomainCardGridProps) => (
  <Grid container spacing={4}>
    {entities.map((e, i) => (
      <Grid item xs={12} md={3} key={i}>
        <DomainCard entity={e} />
      </Grid>
    ))}
  </Grid>
);
