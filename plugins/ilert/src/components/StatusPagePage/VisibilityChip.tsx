/*
 * Copyright 2021 The Backstage Authors
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
import { Chip, withStyles } from '@material-ui/core';
import React from 'react';
import { PRIVATE, PUBLIC, StatusPage } from '../../types';

const PrivateChip = withStyles({
  root: {
    backgroundColor: '#4caf50',
    color: 'white',
    margin: 0,
  },
})(Chip);

const PublicChip = withStyles({
  root: {
    backgroundColor: '#ffb74d',
    color: 'white',
    margin: 0,
  },
})(Chip);

const statusPageVisibilityLabels = {
  [PUBLIC]: 'Public',
  [PRIVATE]: 'Private',
} as Record<string, string>;

export const VisibilityChip = ({ statusPage }: { statusPage: StatusPage }) => {
  const label = `${statusPageVisibilityLabels[statusPage.visibility]}`;

  switch (statusPage.visibility) {
    case PRIVATE:
      return <PrivateChip label={label} size="small" />;
    case PUBLIC:
      return <PublicChip label={label} size="small" />;
    default:
      return <Chip label={label} size="small" />;
  }
};
