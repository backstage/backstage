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
import { createDevApp } from '@backstage/dev-utils';
import { signalsPlugin } from '../src/plugin';
import { CodeSnippet, Content, Header, Page } from '@backstage/core-components';
import Typography from '@material-ui/core/Typography';
import { useSignal } from '@backstage/plugin-signals-react';

const SignalsDebugPage = () => {
  const { lastSignal } = useSignal('debug');
  return (
    <Page themeId="home">
      <Header title="Signals" />
      <Content>
        <Typography>Last signal:</Typography>
        <Typography>
          {lastSignal ? (
            <CodeSnippet text={JSON.stringify(lastSignal)} language="json" />
          ) : (
            'Not received'
          )}
        </Typography>
      </Content>
    </Page>
  );
};

createDevApp()
  .registerPlugin(signalsPlugin)
  .addPage({
    title: 'Debug',
    element: <SignalsDebugPage />,
  })
  .render();
