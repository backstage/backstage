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
import {
  Content,
  ContentHeader,
  Header,
  HeaderLabel,
  Page,
  SupportButton,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useState } from 'react';
import { usePlatformScript } from '../../hooks/usePlatformScript';
import { YAMLEditor } from '../YAMLEditor/YAMLEditor';
import { RenderResult } from './EvalResult';

const FALLBACK = '"false"';

export const SynthComponent = ({ yaml }: { yaml: string }) => {
  const [_yaml, setYaml] = useState(yaml || FALLBACK);
  const result = usePlatformScript(_yaml);

  return (
    <Page themeId="tool">
      <Header title="Welcome to synth-react!" subtitle="Optional subtitle">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Backstage Synth Playground">
          <SupportButton>You can get help in Frontside Discord</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="row">
          <Grid item sm={6}>
            {result.value ? <RenderResult value={result.value} /> : null}
          </Grid>
          <Grid item sm={6}>
            <>
              <YAMLEditor
                onChange={(value = FALLBACK) => setYaml(value)}
                defaultValue={_yaml}
                value={_yaml}
              />
              {result.error ? (
                <Alert severity="error">{String(result.error)}</Alert>
              ) : null}
            </>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
