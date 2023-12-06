/*
 * Copyright 2020 The Backstage Authors
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

/**
 * @public
 * @deprecated This plugin and it's types will be removed in a future release. Please use \@pagerduty/backstage-plugin plugin instead (https://www.npmjs.com/package/\@pagerduty/backstage-plugin).
 */
export type PagerDutyEntity = {
  integrationKey?: string;
  serviceId?: string;
  name: string;
};
