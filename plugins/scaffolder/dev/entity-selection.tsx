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
import { Route, Routes, useParams } from 'react-router-dom';
import { Box, Link, Text } from '@backstage/ui';
// This dev-only entrypoint is a standalone app, not a published plugin entrypoint.
// eslint-disable-next-line @backstage/no-ui-css-imports-in-non-frontend
import '@backstage/ui/css/styles.css';
import { EntitySelectionPickerPlayground } from './EntitySelectionPickerPlayground';

const app = createApp();
const App = app.createRoot(
  <AppRouter>
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
    <Box p="6" bg="neutral">
      <Text as="h1" variant="title-large">
        {name ?? 'Entity'}
      </Text>
      <Text as="p" color="secondary">
        Mock catalog destination
      </Text>
      <Text as="p">
        The selected item links to its entity, independently of editing the
        selection.
      </Text>
      <pre>
        {kind}:{namespace}/{name}
      </pre>
      <Text as="p">
        This mock-backed playground only demonstrates navigation; an application
        would open its catalog entity page.
      </Text>
      <Link href="/">Back to the picker playground</Link>
    </Box>
  );
}
