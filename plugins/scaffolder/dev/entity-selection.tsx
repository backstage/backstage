/*
 * Copyright 2026 The Backstage Authors
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

import { createApp } from '@backstage/app-defaults';
import { AppRouter } from '@backstage/core-app-api';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { Link, Route, Routes, useParams } from 'react-router-dom';
import { Content, Header, Page } from '@backstage/core-components';
import { EntitySelectionPickerPlayground } from './EntitySelectionPickerPlayground';

const app = createApp();
const App = app.createRoot(
  <AppRouter>
    <CssBaseline />
    <Routes>
      <Route path="/" element={<EntitySelectionPickerPlayground />} />
      <Route
        path="/catalog/:kind/:namespace/:name"
        element={<MockCatalogDestination />}
      />
    </Routes>
  </AppRouter>,
);

createRoot(document.getElementById('root')!).render(<App />);

function MockCatalogDestination() {
  const { kind, namespace, name } = useParams();
  return (
    <Page themeId="tool">
      <Header title={name ?? 'Entity'} subtitle="Mock catalog destination" />
      <Content>
        <Typography paragraph>
          The selected item links to its entity, independently of editing the
          selection.
        </Typography>
        <pre>
          {kind}:{namespace}/{name}
        </pre>
        <Typography paragraph>
          This mock-backed playground only demonstrates navigation; an
          application would open its catalog entity page.
        </Typography>
        <Link to="/">Back to the picker playground</Link>
      </Content>
    </Page>
  );
}
