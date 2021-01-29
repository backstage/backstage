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
import { Grid } from '@material-ui/core';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { ItemCard } from '.';

export default {
  title: 'Layout/Item Card',
  component: ItemCard,
};

export const Default = () => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={3}>
      <ItemCard
        title="Item Card"
        description="This is the description of an Item Card"
        label="Button"
        type="Pretitle"
        onClick={() => {}}
      />
    </Grid>
    <Grid item xs={12} md={3}>
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
    <Grid item xs={12} md={3}>
      <ItemCard
        title="Item Card"
        description="This is the description of an Item Card with Tags"
        tags={['one tag', 'one tag']}
        label="Button"
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <ItemCard
        title="Item Card"
        description="This is the description of an Item Card with Tags"
        tags={['one tag', 'two tag']}
        label="Button"
      />
    </Grid>
    <Grid item xs={12} md={3}>
      <ItemCard
        title="Item Card"
        description="This is the description of an Item Card without Tags"
        label="Button"
      />
    </Grid>
  </Grid>
);

export const Link = () => (
  <MemoryRouter>
    <Grid container spacing={4}>
      <Grid item xs={12} md={3}>
        <ItemCard
          title="Backstage"
          description="This is the description of an Item Card with link"
          label="Read More"
          href="https://backstage.io"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <ItemCard
          title="Backstage @ GitHub"
          description="This is the description of an Item Card with link"
          label="Read More"
          href="https://github.com/backstage/backstage"
        />
      </Grid>
    </Grid>
  </MemoryRouter>
);
