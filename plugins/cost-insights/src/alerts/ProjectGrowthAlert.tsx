/*
 * Copyright 2020 Spotify AB
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

import React from 'react';
import { CostInsightsApi } from '../api';
import { ProjectGrowthAlertCard } from '../components/ProjectGrowthAlertCard';
import {
  Alert,
  AlertOptions,
  AlertDismissFormData,
  BaseAlert,
  BaseAlertOptions,
  ProjectGrowthData,
} from '../types';

export abstract class BaseProjectGrowthAlert implements BaseAlert {
  url: string;
  title: string;
  subtitle: string;
  data: ProjectGrowthData;

  static url = '/cost-insights/investigating-growth';
  static subtitle =
    'Cost growth outpacing business growth is unsustainable long-term.';

  constructor(
    data: ProjectGrowthData,
    options: Partial<BaseAlertOptions> = {},
  ) {
    this.data = data;
    this.url = options.url ?? BaseProjectGrowthAlert.url;
    this.title =
      options.title ??
      `Investigate project cost growth in ${this.data.project}`;
    this.subtitle = options.subtitle ?? BaseProjectGrowthAlert.subtitle;
  }

  get element() {
    return <ProjectGrowthAlertCard alert={this.data} />;
  }
}

export class ProjectGrowthAlert extends BaseProjectGrowthAlert
  implements Alert {}

export class CustomProjectGrowthAlert extends BaseProjectGrowthAlert
  implements Alert {
  api: CostInsightsApi;

  constructor(api: CostInsightsApi, data: ProjectGrowthData) {
    super(data);
    this.api = api;
  }

  async onDismissed(_: AlertOptions<AlertDismissFormData>): Promise<Alert[]> {
    return Promise.resolve([]);
  }
}
