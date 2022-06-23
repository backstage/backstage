/*
 * Copyright 2020 The Backstage Authors
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
import { Button } from '@material-ui/core';
import { EmptyState } from '@backstage/core-components';

export const ServiceNotFoundError = () => (
  <EmptyState
    missing="data"
    title="PagerDuty Service Not Found"
    description="A service could not be found within PagerDuty based on the provided annotations. Please verify your annotation details."
    action={
      <Button
        color="primary"
        variant="contained"
        href="https://github.com/backstage/backstage/blob/master/plugins/pagerduty/README.md"
      >
        Read More
      </Button>
    }
  />
);
