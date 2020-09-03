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

import { Entity } from '@backstage/catalog-model';
import { Content } from '@backstage/core';
import { Grid } from '@material-ui/core';
import { Widget as GithubPullListWidget } from '@backstage/plugin-github-prs';
import React, { FC } from 'react';

export const EntityPagePull: FC<{ entity: Entity }> = ({ entity }) => {
  // const url =
  //   'http://localhost:3000/github-pull-requests/Component/' +
  //   entity.metadata.name;
  return (
    <Content>
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <GithubPullListWidget entity={entity} branch="master" />
        </Grid>
      </Grid>
      {/* <Grid container>
        <iframe
          src={url}
          sandbox="allow-scripts allow-same-origin allow-top-navigation allow-forms allow-popups allow-pointer-lock allow-popups-to-escape-sandbox"
          height="1000"
          width="1000"
        />
      </Grid> */}
    </Content>
  );
};
