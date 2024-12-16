/*
 * Copyright 2024 The Backstage Authors
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

import fs from 'fs-extra';
import { resolve as resolvePath } from 'path';
import { InjectOptions } from './types';
import compileTemplate from 'lodash/template';
import { Config, ConfigReader } from '@backstage/config';

const HTML_TEMPLATE_NAME = 'index.html.tmpl';

/** @internal */
export async function injectConfigIntoHtml(
  options: InjectOptions,
): Promise<Buffer | undefined> {
  const { rootDir, appConfigs } = options;

  const templatePath = resolvePath(rootDir, HTML_TEMPLATE_NAME);

  if (!(await fs.exists(templatePath))) {
    return undefined;
  }

  const templateContent = await fs.readFile(
    resolvePath(rootDir, HTML_TEMPLATE_NAME),
    'utf8',
  );

  const config = ConfigReader.fromConfigs(appConfigs);

  const templateSource = compileTemplate(templateContent, {
    interpolate: /<%=([\s\S]+?)%>/g,
  });

  const publicPath = resolvePublicPath(config);
  const indexHtmlContent = templateSource({
    config,
    publicPath,
  });

  const indexHtmlContentWithConfig = indexHtmlContent.replace(
    '</head>',
    `
<script type="backstage.io/config">
${JSON.stringify(appConfigs, null, 2)
  // Note on the security aspects of this: We generally trust the app config to
  // be safe, since control of the app config effectively means full control of
  // the app. These substitutions are here as an extra precaution to avoid
  // unintentionally breaking the app, to avoid this being flagged, and in case
  // someone decides to hook up user input to the app config in their own setup.
  .replaceAll('</script', '')
  .replaceAll('<!--', '')}
</script>
</head>`,
  );

  return Buffer.from(indexHtmlContentWithConfig, 'utf8');
}

export function resolvePublicPath(config: Config) {
  const baseUrl = new URL(
    config.getOptionalString('app.baseUrl') ?? '/',
    'http://localhost:7007',
  );
  return baseUrl.pathname.replace(/\/+$/, '');
}
