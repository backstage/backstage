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
import { Alert, UnlabeledDataflowData, ProjectGrowthData } from '../types';
import { UnlabeledDataflowAlertCard } from '../components/UnlabeledDataflowAlertCard';
import { ProjectGrowthAlertCard } from '../components/ProjectGrowthAlertCard';

/**
 * The alerts below are examples of Alert implementation; the CostInsightsApi permits returning
 * any implementation of the Alert type, so adopters can create their own. The CostInsightsApi
 * fetches alert data from the backend, then creates Alert classes with the data.
 */

export class UnlabeledDataflowAlert implements Alert {
  data: UnlabeledDataflowData;

  constructor(data: UnlabeledDataflowData) {
    this.data = data;
  }

  title = 'Add labels to workflows';
  subtitle =
    'Labels show in billing data, enabling cost insights for each workflow.';
  url = '/cost-insights/labeling-jobs';

  get element() {
    return <UnlabeledDataflowAlertCard alert={this.data} />;
  }
}

export class ProjectGrowthAlert implements Alert {
  data: ProjectGrowthData;

  constructor(data: ProjectGrowthData) {
    this.data = data;
  }

  get title() {
    return `Investigate cost growth in project ${this.data.project}`;
  }

  subtitle =
    'Cost growth outpacing business growth is unsustainable long-term.';
  url = '/cost-insights/investigating-growth';

  get element() {
    return <ProjectGrowthAlertCard alert={this.data} />;
  }
}
