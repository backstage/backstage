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
import { ProjectGrowthAlertCard } from '../components/ProjectGrowthAlertCard';
import {
  Alert,
  AlertForm,
  AlertOptions,
  Maybe,
  ProjectGrowthData,
} from '../types';

/**
 * The alert below is an example of an Alert implementation; the CostInsightsApi permits returning
 * any implementation of the Alert type, so adopters can create their own. The CostInsightsApi
 * fetches alert data from the backend, then creates Alert classes with the data.
 */

export class ProjectGrowthAlert implements Alert {
  data: ProjectGrowthData;
  url: string;
  title: string;
  subtitle: string;
  SnoozeForm?: Maybe<AlertForm>;
  AcceptForm?: Maybe<AlertForm>;
  DismissForm?: Maybe<AlertForm>;
  onSnoozed?(options: AlertOptions): Promise<Alert[]>;
  onAccepted?(options: AlertOptions): Promise<Alert[]>;
  onDismissed?(options: AlertOptions): Promise<Alert[]>;

  // Simple constructor override. No support for additional props on on defaults.
  constructor(data: ProjectGrowthData, options: Partial<Alert> = {}) {
    const {
      title = `Investigate cost growth in project ${data.project}`,
      subtitle = 'Cost growth outpacing business growth is unsustainable long-term.',
      url = '/cost-insights/investigating-growth',
      element = <ProjectGrowthAlertCard alert={data} />,
      ...opts
    } = options;

    this.data = data;
    this.url = url;
    this.title = title;
    this.subtitle = subtitle;
    this.SnoozeForm = opts.SnoozeForm;
    this.AcceptForm = opts.AcceptForm;
    this.DismissForm = opts.DismissForm;
    this.onSnoozed = opts.onSnoozed;
    this.onAccepted = opts.onAccepted;
    this.onDismissed = opts.onDismissed;
  }
}
