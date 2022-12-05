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
import React, { useState } from 'react';
import { usePlatformScript } from '../../hooks/usePlatformScript';
import { YAMLEditor } from '../YAMLEditor/YAMLEditor';

const EvalResult = ({ yaml }: { yaml: string }) => {
  const result = usePlatformScript(yaml);

  if (result.loading) {
    return <>Loading...</>;
  }

  if (result.error) {
    return <>{result.error.message}</>;
  }

  return <>{result.value}</>;
};

export const SynthComponent = ({ yaml }: { yaml: string }) => {
  const [_yaml, setYaml] = useState(yaml);

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
            <EvalResult yaml={_yaml} />
          </Grid>
          <Grid item sm={6}>
            <YAMLEditor
              onChange={(value = '"false"') => setYaml(value)}
              defaultValue={_yaml}
              value={_yaml}
            />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
