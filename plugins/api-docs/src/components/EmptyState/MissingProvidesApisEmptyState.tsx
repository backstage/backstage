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
import { Button, makeStyles, Typography } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import { CodeSnippet, EmptyState } from '@backstage/core';

const COMPONENT_YAML = `# Example
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example
spec:
  type: service
  lifecycle: production
  owner: guest
  providesApis:
    - example-api
`;

const useStyles = makeStyles<BackstageTheme>(theme => ({
  code: {
    borderRadius: 6,
    margin: `${theme.spacing(2)}px 0px`,
    background: theme.palette.type === 'dark' ? '#444' : '#fff',
  },
}));

export const MissingProvidesApisEmptyState = () => {
  const classes = useStyles();
  return (
    <EmptyState
      missing="field"
      title="No APIs provided by this entity"
      description={
        <>
          Components can implement APIs that are displayed on this page. You
          need to fill the <code>providesApis</code> field to enable this tool.
        </>
      }
      action={
        <>
          <Typography variant="body1">
            Link an API to your component as shown in the highlighted example
            below:
          </Typography>
          <div className={classes.code}>
            <CodeSnippet
              text={COMPONENT_YAML}
              language="yaml"
              showLineNumbers
              highlightedNumbers={[10, 11]}
              customStyle={{ background: 'inherit', fontSize: '115%' }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            href="https://backstage.io/docs/features/software-catalog/descriptor-format#specprovidesapis-optional"
          >
            Read more
          </Button>
        </>
      }
    />
  );
};
