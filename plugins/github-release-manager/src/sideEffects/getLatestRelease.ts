/*
 * Copyright 2021 Spotify AB
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
import { ApiClient } from '../api/ApiClient';

interface GetLatestRelease {
  apiClient: ApiClient;
}

export async function getLatestRelease({ apiClient }: GetLatestRelease) {
  const { releases } = await apiClient.getReleases();

  if (releases.length === 0) {
    return null;
  }

  const { latestRelease } = await apiClient.getRelease({
    releaseId: releases[0].id,
  });

  return latestRelease;
}
