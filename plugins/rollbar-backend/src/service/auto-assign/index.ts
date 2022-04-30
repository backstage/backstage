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

import { AutoAssignOptions, RollbarItem } from './type';

export const enableAssignRoute = ({
  router,
  logger,
  rollbarApi,
  rollbarCheck,
}: AutoAssignOptions) => {
  router.post('/assign', async (request, response) => {
    logger.debug(`New Item from Rollbar! ${request.body.data.url}`);

    const rollbarData = request.body.data;
    const item = rollbarData.item as RollbarItem;
    const result = await rollbarCheck.runChecks(item);

    if (result) {
      const projectId = item.project_id;
      await rollbarApi.updateItem(projectId, item.id, {
        assigned_user_id: result.ownerUserId,
      });
    }

    response.status(200).send();
  });
};
