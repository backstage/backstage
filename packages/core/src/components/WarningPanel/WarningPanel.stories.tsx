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
import WarningPanel from '.';
import { Link, Button } from '@material-ui/core';

export default {
  title: 'Warning Panel',
  component: WarningPanel,
};

export const Default = () => (
  <WarningPanel
    title="Example Warning Title"
    message={
      <>
        This example entity is missing something. If this is unexpected, please
        make sure you have set up everything correctly by following{' '}
        <Link href="http://example.com">this guide</Link>.
      </>
    }
  />
);

export const Children = () => (
  <WarningPanel title="Example Warning Title">
    <Button variant="outlined" color="primary">
      Supports custom children - for example this button
    </Button>
  </WarningPanel>
);
