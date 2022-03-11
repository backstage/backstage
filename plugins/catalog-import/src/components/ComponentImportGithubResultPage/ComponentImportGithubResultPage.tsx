/*
 * Copyright 2022 The Backstage Authors
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

/*
 * Copyright 2022 The Backstage Authors
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
import {
  Content,
  ContentHeader,
  Header,
  Page,
} from '@backstage/core-components';
import { Box, Breadcrumbs, Button, Typography } from '@material-ui/core';
import React from 'react';
import { Link as NavLink, useLocation, useNavigate } from 'react-router-dom';
import { GithubDiscoveryResult } from './GithubDiscoveryResult';
import { GithubRepositoryResult } from './GithubRepositoriesResult';

type ResultState =
  | { kind: 'discovery'; discoveryUrl: string }
  | { kind: 'repositories'; entities: Entity[] };

export const ComponentImportGithubResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultState;

  return (
    <Page themeId="tool">
      <Header title="Catalog Import" />
      <Content>
        <Box mb={2}>
          <Breadcrumbs aria-label="breadcrumb">
            <NavLink color="inherit" to="/catalog-import">
              Import
            </NavLink>
            <NavLink color="inherit" to="/catalog-import/components">
              Software components
            </NavLink>
            <Typography color="textPrimary">Results</Typography>
          </Breadcrumbs>
        </Box>
        <ContentHeader title="Import success!  🎉 🎉 🎉" />
        <Typography paragraph>I think this deserves a high five.</Typography>
        {/* <div>{JSON.stringify(state)}</div> */}
        {state.kind === 'discovery' ? (
          <GithubDiscoveryResult discoveryUrl={state.discoveryUrl} />
        ) : (
          <GithubRepositoryResult entities={state.entities} />
        )}
        <Button
          variant="contained"
          color="primary"
          style={{ marginRight: 8 }}
          onClick={() => navigate('/catalog')}
        >
          To the catalog!
        </Button>
        <Button variant="outlined" onClick={() => navigate('/catalog-import')}>
          Import more
        </Button>{' '}
      </Content>
    </Page>
  );
};
