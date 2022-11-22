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
  formatSummary,
  listChangedFiles,
  listChangedPackages,
  listPackages,
  loadChangesets,
} from './generate-changeset-feedback';

export default async (diffRef: string = 'origin/master') => {
  const changedFiles = await listChangedFiles(diffRef);
  const packages = await listPackages();

  const changesets = await loadChangesets(changedFiles);
  const changedPackages = await listChangedPackages(changedFiles, packages);

  process.stderr.write(
    JSON.stringify(
      {
        changesets,
        changedPackages,
      },
      null,
      2,
    ),
  );

  const summary = formatSummary(changedPackages, changesets);
  process.stdout.write(summary);
};
