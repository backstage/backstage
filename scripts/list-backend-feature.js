#!/usr/bin/env node
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

const fs = require('fs-extra');
const { getPackages } = require('@manypkg/get-packages');
const { resolve, join } = require('path');
const arrayToTable = require('array-to-table');

async function main(args) {
  const rootPath = resolve(__dirname, '..');
  const { packages } = await getPackages(rootPath);

  const backendFeatureReports = [];

  for (const pkg of packages) {
    pkgRole = pkg.packageJson.backstage?.role;

    if (pkgRole === 'backend-plugin' || pkgRole === 'backend-plugin-module') {
      const backendFeatureReport = {
        package: undefined,
        role: undefined,
        migrated: undefined,
        alpha: undefined,
        readme: undefined,
      };
      backendFeatureReport.package = pkg.packageJson.name;
      backendFeatureReport.role = pkgRole;
      backendFeatureReport.readme = `[README](${pkg.packageJson.repository.url}/blob/master/${pkg.packageJson.repository.directory}/README.md)`;
      const apiReportPath = join(pkg.dir, 'api-report.md');
      const apiReport = (await fs.readFile(apiReportPath)).toString();
      // console.log(apiReport)
      if (
        apiReport.includes(
          "import { BackendFeature } from '@backstage/backend-plugin-api';",
        )
      ) {
        backendFeatureReport.migrated = true;
        backendFeatureReport.alpha = false;
      }

      const apiReportAlphaPath = join(pkg.dir, 'report-alpha.api.md');
      if (fs.existsSync(apiReportAlphaPath)) {
        const apiReportAlpha = (
          await fs.readFile(apiReportAlphaPath)
        ).toString();
        if (
          apiReportAlpha.includes(
            "import { BackendFeature } from '@backstage/backend-plugin-api';",
          )
        ) {
          backendFeatureReport.migrated = true;
          backendFeatureReport.alpha = true;
        }
      }

      backendFeatureReports.push(backendFeatureReport);
    }
  }

  const table = args.includes('--table');

  if (table) {
    console.log(arrayToTable(backendFeatureReports));
  } else {
    console.log(backendFeatureReports);
  }
}

main(process.argv.slice(2)).catch(error => {
  console.error(error.stack || error);
  process.exit(1);
});
