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

import { TypedRouter } from '@backstage/backend-openapi-utils';
import { EndpointMap } from '../../schema/openapi';
import { UpsertSubscriptionModel } from './UpsertSubscription.model';

export function bindUpsertSubscriptionEndpoint(
  router: TypedRouter<EndpointMap>,
  model: UpsertSubscriptionModel,
): void {
  router.post('/history/v1/subscriptions', async (req, res) => {
    const subscriptionSpec = req.body ?? {};
    const subscription = await model.upsertSubscription({ subscriptionSpec });
    res.json({ subscription });
  });
}
