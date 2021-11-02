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

import React from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { Progress } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import { ChecksOverview } from './ChecksOverview';
import Alert from '@material-ui/lab/Alert';
import { scorecardsApiRef } from '../../api/ScorecardsApi';

export const ScorecardsOverview = () => {
  const api = useApi(scorecardsApiRef);
  const { namespace, kind, name } = useParams();

  const { value, loading, error } = useAsync(
    async () => await api.fetchChecks({ namespace, kind, name }),
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <ChecksOverview checks={value || []} />;
};
