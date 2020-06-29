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
import { ItemCard } from '.';
import { Grid } from '@material-ui/core';

export default {
  title: 'Item Card',
  component: ItemCard,
};

const Wrapper: FC<{}> = ({ children }) => (
  <Grid container spacing={4}>
    <Grid item>{children}</Grid>
  </Grid>
);

export const Default = () => (
  <Wrapper>
    <ItemCard description="Test" title="Item Card" label="Button" />
  </Wrapper>
);
