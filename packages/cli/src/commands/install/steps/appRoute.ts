/*
 * Copyright 2021 The Backstage Authors
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
import { paths } from '../../../lib/paths';
import { Step, createStepDefinition } from '../types';

type Data = {
  path: string;
  element: string;
  packageName: string;
};

class AppRouteStep implements Step {
  constructor(private readonly data: Data) {}

  async run() {
    const { path, element, packageName } = this.data;

    const appTsxPath = paths.resolveTargetRoot('packages/app/src/App.tsx');
    const contents = await fs.readFile(appTsxPath, 'utf-8');
    let failed = false;

    // Add a new route just above the end of the FlatRoutes block
    const contentsWithRoute = contents.replace(
      /(\s*)<\/FlatRoutes>/,
      `$1  <Route path="${path}" element={${element}} />$1</FlatRoutes>`,
    );
    if (contentsWithRoute === contents) {
      failed = true;
    }

    // Grab the component name from the element
    const componentName = element.match(/[A-Za-z0-9]+/)?.[0];
    if (!componentName) {
      throw new Error(`Could not find component name in ${element}`);
    }

    // Add plugin import
    // TODO(Rugvip): Attempt to add this among the other plugin imports
    const contentsWithImport = contentsWithRoute.replace(
      /^import /m,
      `import { ${componentName} } from '${packageName}';\nimport `,
    );
    if (contentsWithImport === contentsWithRoute) {
      failed = true;
    }

    if (failed) {
      console.log(
        'Failed to automatically add a route to package/app/src/App.tsx',
      );
      console.log(`Action needed, add the following:`);
      console.log(`1. import { ${componentName} } from '${packageName}';`);
      console.log(`2. <Route path="${path}" element={${element}} />`);
    } else {
      await fs.writeFile(appTsxPath, contentsWithImport);
    }
  }
}

export const appRoute = createStepDefinition<Data>({
  type: 'app-route',

  deserialize(obj, pkg) {
    const { path, element } = obj;
    if (!path || typeof path !== 'string') {
      throw new Error("Invalid install step, 'path' must be a string");
    }
    if (!element || typeof element !== 'string') {
      throw new Error("Invalid install step, 'element' must be a string");
    }
    return new AppRouteStep({ path, element, packageName: pkg.name });
  },

  create(data: Data) {
    return new AppRouteStep(data);
  },
});
