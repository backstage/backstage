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

/* eslint-disable jsx-a11y/no-autofocus */

import React, { useRef, useState } from 'react';
import {
  CodeSnippet,
  Content,
  ContentHeader,
  Header,
  Link,
  Page,
} from '@backstage/core-components';
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { useNavigate, useParams } from 'react-router';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';

export const ComponentImportGithubDiscoveryPage = () => {
  const { host, org } = useParams();
  const navigate = useNavigate();
  const catalogApi = useApi(catalogApiRef);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>();

  async function handleClick() {
    if (inputRef.current) {
      setSaving(true);
      const url = inputRef.current.value;
      await catalogApi.addLocation({
        type: 'github-discovery',
        target: url,
      });
      navigate('/catalog-import/components/github/results', {
        state: { kind: 'discovery', discoveryUrl: url },
      });
    }
  }

  return (
    <Page themeId="tool">
      <Header title="Catalog Import" />
      <Content>
        <Box mb={2}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" to="/catalog-import">
              Import
            </Link>
            <Link color="inherit" to="/catalog-import/components">
              Software components
            </Link>
            <Link
              color="inherit"
              to={`/catalog-import/components/github/${host}`}
            >
              Organization
            </Link>
            <Typography color="textPrimary">Discovery</Typography>
          </Breadcrumbs>
        </Box>
        <ContentHeader title="Set up GitHub discovery" />
        <Grid container>
          <Grid item xs={8}>
            <Typography paragraph>
              GitHub discovery gives Backstage a path to crawl periodically,
              looking for new software components to register. For a GitHub
              organization without many repositories, this might be as simple as
              providing the organization URL:
              <CodeSnippet text={`https://${host}/${org}`} language="shell" />
            </Typography>
            <Typography paragraph>
              For larger organizations where an exhaustive scan may risk hitting
              GitHub API limits, or when using a different filename than the
              default <pre style={{ display: 'inline' }}>catalog-info.yaml</pre>
              , a more complex path can be provided.
            </Typography>
            <Typography paragraph>
              The URL may also contain an asterisk{' '}
              <pre style={{ display: 'inline' }}>*</pre> to match anything in
              part of the URL, or a dash{' '}
              <pre style={{ display: 'inline' }}>-</pre> to represent the
              default branch (which may be different per repository). Here are
              some examples:
              <CodeSnippet
                text={`https://${host}/${org}/*/blob/-/catalog-info.yaml`}
                language="shell"
              />
              <CodeSnippet
                text={`https://${host}/${org}/service-*/blob/-/service-info.yaml`}
                language="shell"
              />
            </Typography>
            <Box mt={4} mb={2}>
              <Typography variant="h6" paragraph>
                GitHub discovery path for {org}:
              </Typography>
              <TextField
                variant="outlined"
                defaultValue={`https://${host}/${org}/*/blob/-/catalog-info.yaml`}
                color="primary"
                style={{ width: '100%' }}
                inputRef={inputRef}
                disabled={saving}
                autoFocus
              />
            </Box>
            <Button
              color="primary"
              variant="contained"
              onClick={handleClick}
              disabled={saving}
            >
              {saving && (
                <CircularProgress size={14} style={{ marginRight: 8 }} />
              )}
              {saving ? 'Adding...' : 'Add discovery URL'}
            </Button>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
