/*
 * Copyright 2025 The Backstage Authors
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

import { CliAuth } from '@backstage/cli-node';

export async function resolveAuth(instanceFlag?: string): Promise<{
  baseUrl: string;
  accessToken: string;
}> {
  const auth = await CliAuth.create({ instanceName: instanceFlag });
  const accessToken = await auth.getAccessToken();
  return { baseUrl: auth.getBaseUrl(), accessToken };
}
