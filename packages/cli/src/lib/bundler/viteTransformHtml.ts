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

import { PluginOption } from 'vite';
import fs from 'fs/promises';
import { render } from 'ejs';
import { relative } from 'path';

export const viteTransformHtml = ({
  targetHtml,
  entryPath,
  data,
}: {
  targetHtml: string;
  entryPath: string;
  data: any;
}): PluginOption => ({
  name: 'backstage:transform:html',
  configureServer(s) {
    s.middlewares.use(async (req, res, next) => {
      const html = await fs.readFile(targetHtml, 'utf-8');
      const rendered = `${render(html, data)}
      <script type="module" src="${relative(targetHtml, entryPath)}"></script>`;

      if (req.url === '/') {
        res.end(await s.transformIndexHtml(req.url, rendered));
      } else {
        next();
      }
    });
  },
});
