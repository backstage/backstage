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
import { EntitySelectionPickerPlayground } from './EntitySelectionPickerPlayground';

const app = createApp();
const App = app.createRoot(
  <AppRouter>
    <CssBaseline />
    <EntitySelectionPickerPlayground />
  </AppRouter>,
);

createRoot(document.getElementById('root')!).render(<App />);
