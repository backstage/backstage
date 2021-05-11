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

// TODO align this design with the backend errors

import React from 'react';
import { AppComponents } from '../..';
import { ResponseErrorPanel } from '../ResponseErrorPanel';
import { Button } from '@material-ui/core';

export const ErrorBoundaryFallback: AppComponents['ErrorBoundaryFallback'] = ({
  error,
  resetError,
  plugin,
}) => {
  return (
    <ResponseErrorPanel
      title={`Error in ${plugin?.getId()}`}
      defaultExpanded
      error={error}
      actions={
        <Button variant="outlined" onClick={resetError}>
          Retry
        </Button>
      }
    />
  );
};
