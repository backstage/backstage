/*
 * Copyright 2024 The Backstage Authors
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
import { CodeSnippet, MarkdownContent } from '@backstage/core-components';
import { ScaffolderUsageExample } from '@backstage/plugin-scaffolder-react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React, { Fragment } from 'react';

export const ScaffolderUsageExamplesTable = (props: {
  examples: ScaffolderUsageExample[];
}) => {
  return (
    <Grid data-testid="examples" container>
      {props.examples.map((example, index) => {
        return (
          <Fragment key={`example-${index}`}>
            <Grid data-testid={`example_desc${index}`} item lg={3}>
              <Box padding={1} style={{ overflowX: 'auto' }}>
                {example.description && (
                  <MarkdownContent content={example.description} />
                )}
                {example.notes?.length && (
                  <MarkdownContent content={example.notes} />
                )}
              </Box>
            </Grid>
            <Grid data-testid={`example_code${index}`} item lg={9}>
              <Box padding={1}>
                <CodeSnippet
                  text={example.example?.trim()}
                  showLineNumbers
                  showCopyCodeButton
                  language="yaml"
                />
              </Box>
            </Grid>
          </Fragment>
        );
      })}
    </Grid>
  );
};
