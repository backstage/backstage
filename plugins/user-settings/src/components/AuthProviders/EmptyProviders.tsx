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
import { CodeSnippet, EmptyState } from '@backstage/core';
import { Button, Typography } from '@material-ui/core';

const EXAMPLE = `
import { createPlugin } from '@backstage/core';

export default createPlugin({
  id: 'welcome',
  register({ router, featureFlags }) {
    featureFlags.register('enable-example-feature');
  },
});
`;

export const EmptyProviders = () => (
  <EmptyState
    missing="content"
    title="No Authentication Providers"
    description=""
    action={
      <>
        <Typography variant="body1">
          An example how how to add a feature flags is highlighted below:
        </Typography>
        <CodeSnippet
          text={EXAMPLE}
          language="typescript"
          showLineNumbers
          highlightedNumbers={[7]}
          customStyle={{ background: 'inherit', fontSize: '115%' }}
        />
        <Button
          variant="contained"
          color="primary"
          href="https://backstage.io/docs/api/utility-apis"
        >
          Read More
        </Button>
      </>
    }
  />
);
