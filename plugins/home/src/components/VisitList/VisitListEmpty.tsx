/*
 * Copyright 2023 The Backstage Authors
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
import { Typography } from '@material-ui/core';

export const VisitListEmpty = () => (
  <>
    <Typography variant="body2" color="textSecondary">
      There are no visits to show yet.
    </Typography>
    <Typography variant="body2" color="textSecondary">
      Once you start using Backstage, your visits will appear here as a quick
      link to carry on where you left off.
    </Typography>
  </>
);
