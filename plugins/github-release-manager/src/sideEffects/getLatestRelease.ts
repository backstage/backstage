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

import { PluginApiClient } from '../api/PluginApiClient';
import { Project } from '../contexts/ProjectContext';

interface GetLatestRelease {
  pluginApiClient: PluginApiClient;
  project: Project;
}

export async function getLatestRelease({
  pluginApiClient,
  project,
}: GetLatestRelease) {
  const { releases } = await pluginApiClient.getReleases({ ...project });

  if (releases.length === 0) {
    return null;
  }

  const { latestRelease } = await pluginApiClient.getRelease({
    ...project,
    releaseId: releases[0].id,
  });

  return latestRelease;
}
