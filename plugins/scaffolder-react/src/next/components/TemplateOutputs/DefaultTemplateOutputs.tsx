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
import { Box, Paper } from '@material-ui/core';
import { LinkOutputs } from './LinkOutputs';
import { ScaffolderTaskOutput } from '@backstage/plugin-scaffolder-react';

/**
 * The DefaultOutputs renderer for the scaffolder task output
 *
 * @alpha
 */
export const DefaultTemplateOutputs = (props: {
  output?: ScaffolderTaskOutput;
}) => {
  if (!props.output?.links) {
    return null;
  }

  return (
    <Box paddingBottom={2}>
      <Paper>
        <Box padding={2} justifyContent="center" display="flex" gridGap={16}>
          <LinkOutputs output={props.output} />
        </Box>
      </Paper>
    </Box>
  );
};
