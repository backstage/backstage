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

export function logApiReportInstructions() {
  console.log('');
  console.log(
    '*************************************************************************************',
  );
  console.log(
    '* You have uncommitted changes to the public API or reports of a package.           *',
  );
  console.log(
    '* To solve this, run `yarn build:api-reports` and commit all md file changes.       *',
  );
  console.log(
    '*************************************************************************************',
  );
  console.log('');
}
