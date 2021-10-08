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

import { Box } from '@material-ui/core';
import { Progress } from '@backstage/core-components';

import { useReaderState } from './useReaderState';

const states = ['INITIAL_BUILD', 'CONTENT_STALE_REFRESHING'];

/**
 * Note: this component is currently being exported so that we can rapidly
 * iterate on alternative <Reader /> implementations that extend core
 * functionality. There is no guarantee that this component will continue to be
 * exported by the package in the future!
 *
 * todo: Make public or stop exporting (ctrl+f "altReaderExperiments")
 * @internal
 */
export const TechDocsProgress = () => {
  const { namespace = '', kind = '', name = '', '*': params } = useParams();
  const { state } = useReaderState(kind, namespace, name, params);
  return states.includes(state) ? (
    <Box mb={3}>
      <Progress />
    </Box>
  ) : null;
};
