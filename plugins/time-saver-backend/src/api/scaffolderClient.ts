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
import { Logger } from 'winston';

export class ScaffolderClient {
  constructor(private readonly logger: Logger) {}
  private readonly backendUrl = 'http://127.0.0.1:7007';

  async fetchTemplatesFromScaffolder() {
    const templatePath = '/api/scaffolder/v2/tasks';
    const callUrl = `${this.backendUrl}${templatePath}`;

    let templateTaskList = [];
    try {
      const response = await fetch(callUrl, {
        method: 'GET',
      });
      this.logger.info(response);
      const data = await response.json();
      templateTaskList = data.tasks;
    } catch (error) {
      this.logger.error(
        `Problem retriving response from url: ${callUrl}`,
        error,
      );
      return [];
    }
    return templateTaskList;
  }
}
