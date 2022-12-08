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
import { createDevApp } from '@backstage/dev-utils';
import { synthPlugin, SynthPage } from '../src/plugin';

const HELLO_WORLD = `$import:
    - names: [<h1>]
      from: ./html.yaml
$do:
  $let:
    <Card>:
      $B.Component:
        type: { $B.resolve: "@material-ui/core/Card" }
    <Typography>:
      $B.Component:
        type: { $B.resolve: "@material-ui/core/Typography" }
    <Grid>:
      $B.Component:
        type: { $B.resolve: "@material-ui/core/Grid" }
    makeStyles: { $B.resolve: "@material-ui/core/styles/makeStyles" }
  $do:
    $let:
      useStyles:
        $makeStyles:
          gridItemCard:
            display: flex
            flexDirection: column
            height: calc(100% - 10px)
            marginBottom: 10px
          fullHeightCard:
            display: flex
            flexDirection: column
            height: 100%
          gridItemCardContent:
            flex: 1
          fullHeightCardContent:
            flex: 1
    $do:
      $let:
        classes: { useStyles: true }
      $do:
        $<Card>:
          className: gridItem
`;

createDevApp()
  .registerPlugin(synthPlugin)
  .addPage({
    element: <SynthPage yaml={HELLO_WORLD} />,
    title: 'Synth Page',
    path: '/synth-react',
  })
  .render();
