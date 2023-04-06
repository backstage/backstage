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

import React, { useState } from 'react';
import { Content, Header, LinkButton, Page } from '@backstage/core-components';
import { EntityTextArea } from '../EntityTextArea';
import { Grid, TextField } from '@material-ui/core';
import { CatalogProcessorResult } from '../../types';
import { parseEntityYaml } from '../../utils';
import { EntityValidationOutput } from '../EntityValidationOutput';

const EXAMPLE_CATALOG_INFO_YAML = `# Put your catalog-info.yaml below and validate it
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: test
  description: Component description
  links: []
  tags: []
  annotations: {}
spec:
  type: service
  lifecycle: experimental
  owner: owner
`;

export const EntityValidationPage = (props: {
  defaultYaml?: string;
  defaultLocation?: string;
}) => {
  const {
    defaultYaml = EXAMPLE_CATALOG_INFO_YAML,
    defaultLocation = 'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
  } = props;

  const [catalogYaml, setCatalogYaml] = useState(defaultYaml);
  const [yamlFiles, setYamlFiles] = useState<CatalogProcessorResult[]>();
  const [locationUrl, setLocationUrl] = useState(defaultLocation);

  const parseYaml = () => {
    const parsedFiles = [
      ...parseEntityYaml(Buffer.from(catalogYaml), {
        type: 'url',
        target: locationUrl ? locationUrl : 'http://localhost',
      }),
    ];
    setYamlFiles(parsedFiles);
  };

  return (
    <Page themeId="tool">
      <Header
        title="Entity Validator"
        subtitle="Tool to validate catalog-info.yaml files"
      />
      <Content>
        <Grid container>
          <Grid item md={9} xs={12}>
            <TextField
              fullWidth
              label="File Location"
              margin="normal"
              variant="outlined"
              required
              value={locationUrl}
              placeholder={defaultLocation}
              helperText="Location where you catalog-info.yaml file is, or will be, located"
              onChange={e => setLocationUrl(e.target.value)}
            />
          </Grid>
          <Grid item md={3} xs={12}>
            <Grid container alignItems="center" style={{ height: '100%' }}>
              <Grid item>
                <LinkButton size="large" onClick={parseYaml} to="#">
                  Validate
                </LinkButton>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container direction="row" style={{ height: '90%' }}>
          <Grid item md={6} xs={12}>
            <EntityTextArea
              onValidate={parseYaml}
              onChange={(value: string) => setCatalogYaml(value)}
              catalogYaml={catalogYaml}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <EntityValidationOutput
                  processorResults={yamlFiles}
                  locationUrl={locationUrl}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
