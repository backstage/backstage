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
import { UnlabeledDataflowAlertCard } from '../components/UnlabeledDataflowAlertCard';
import {
  Alert,
  BaseAlert,
  BaseAlertOptions,
  UnlabeledDataflowData,
} from '../types';

export abstract class BaseUnlabeledDataflowAlert implements BaseAlert {
  url: string;
  title: string;
  subtitle: string;
  data: UnlabeledDataflowData;

  static url = '/cost-insights/labeling-jobs';
  static title = 'Add labels to workflows';
  static subtitle =
    'Labels show in billing data, enabling cost insights for each workflow.';

  constructor(
    data: UnlabeledDataflowData,
    options: Partial<BaseAlertOptions> = {},
  ) {
    this.data = data;
    this.url = options.url ?? BaseUnlabeledDataflowAlert.url;
    this.title = options.title ?? BaseUnlabeledDataflowAlert.title;
    this.subtitle = options.subtitle ?? BaseUnlabeledDataflowAlert.subtitle;
  }

  get element() {
    return <UnlabeledDataflowAlertCard alert={this.data} />;
  }
}
/**
 * /**
 * The CostInsightsApi permits returning any implementation of the Alert type,
 * so adopters can create their own. The CostInsightsApi fetches alert data from the backend,
 * then creates Alert classes with the data.
 *
 * Quick Setup:
 * const dfAlert = new UnlabeledDataflowAlert(data);
 *
 * Simple Override w/o hooks:
 * const dfAlert = new UnlabeledDataflowAlert(data, { title: 'My Custom title' });
 *
 * Advanced Override w/ hooks:
 * class MyDataflowAlert extends BaseUnlabeledDataflowAlert implements Alert {
 *  title = 'My Custom Title';
 *
 *  async onDismissed(options: AlertOptions<AlertDismissFormData>){ ... }
 *
 *  async onAccepted(options: AlertOptions<AlertAcceptFormData>) { ... }
 *
 *  async onSnoozed(options: AlertOptions<AlertSnoozeFormData>) { ... }
 * }
 *
 * const dfAlert = new MyDataflowAlert(data);
 *
 */
export class UnlabeledDataflowAlert extends BaseUnlabeledDataflowAlert
  implements Alert {}
