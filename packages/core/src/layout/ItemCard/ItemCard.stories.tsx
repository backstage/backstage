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
import React from 'react';
import { ItemCard } from '.';
import { Grid } from '@material-ui/core';

export default {
  title: 'Item Card',
  component: ItemCard,
};

export const Default = () => (
  <Grid container spacing={4}>
    <Grid item xs={6} sm={4} md={2}>
      <ItemCard
        title="Item Card"
        description="This is the description of an Item Card"
        label="Button"
        type="Pretitle"
        onClick={() => {}}
      />
    </Grid>
    <Grid item xs={6} sm={4} md={2}>
      <ItemCard
        title="Item Card"
        description="This is the description of an Item Card"
        label="Button"
        type="Pretitle"
        onClick={() => {}}
      />
    </Grid>
  </Grid>
);

export const Tags = () => (
  <Grid container spacing={4}>
    <Grid item xs={6} sm={4} md={2}>
      <ItemCard
        title="Item Card"
        description="This is a Item Card"
        tags={['one tag', 'two tag']}
        label="Button"
      />
    </Grid>
    <Grid item xs={6} sm={4} md={2}>
      <ItemCard
        title="Item Card"
        description="This is a Item Card"
        tags={['one tag', 'two tag']}
        label="Button"
      />
    </Grid>
  </Grid>
);
