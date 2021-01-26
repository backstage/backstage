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
import pluralize from 'pluralize';
import { MigrationAlertCard } from '../components/MigrationAlertCard';
import { CostInsightsApi } from '../api';
import {
  Alert,
  AlertForm,
  AlertOptions,
  AlertStatus,
  AlertSnoozeFormData,
  ChangeStatistic,
  Entity,
} from '../types';
import { MigrationDismissForm, MigrationDismissFormData } from '../forms';

export interface MigrationData {
  startDate: string;
  endDate: string;
  change: ChangeStatistic;
  services: Array<Entity>;
}

export interface MigrationAlert extends Alert {
  api: CostInsightsApi;
  data: MigrationData;
}

/**
 * This is an example of an Alert implementation using optional event hooks.
 *
 * Event hooks can be used to enable users to dismiss, snooze, or accept an action item
 * - or any combination thereof. Defining a hook will generate default UI - button, dialog and
 * form. Cost Insights does not preserve client side alert state - each hook is expected to return a new set of alerts.
 *
 * Snoozed, accepted, etc. alerts should define a corresponding status property. Alerts will be aggregated
 * by status in a collapsed view below Alert Insights section and a badge will appear in Action Items
 * showing the total alerts of that status.
 *
 * Default forms can be overridden by providing a valid React form component. Form components
 * must return valid form elements, and accept a ref and onSubmit event handler. See /forms
 * for example implementations. Custom forms must implement a corresponding event hook.
 */

export class KubernetesMigrationAlert implements MigrationAlert {
  api: CostInsightsApi;
  data: MigrationData;

  subtitle =
    'Services running on Kubernetes are estimated to save 50% or more compared to Compute Engine.';

  // Override default dismiss form with a custom form component.
  DismissForm: AlertForm<
    MigrationAlert,
    MigrationDismissFormData
  > = MigrationDismissForm;

  constructor(api: CostInsightsApi, data: MigrationData) {
    this.api = api;
    this.data = data;
  }

  get title() {
    return `Consider migrating ${pluralize(
      'service',
      this.data.services.length,
      true,
    )} to Kubernetes.`;
  }

  get element() {
    const subheader = `${pluralize(
      'Compute Engine role',
      this.data.services.length,
      true,
    )}, sorted by cost`;
    return (
      <MigrationAlertCard
        data={this.data}
        title="Migrate to Kubernetes"
        subheader={subheader}
        currentProduct="Compute Engine"
        comparedProduct="Kubernetes"
      />
    );
  }

  /* Fires when the onSubmit event is raised on a DismissAlert form. Displays a custom dismiss form. */
  async onDismissed(
    options: AlertOptions<MigrationDismissFormData>,
  ): Promise<Alert[]> {
    const alerts = await this.api.getAlerts(options.group);
    return new Promise(resolve =>
      setTimeout(resolve, 750, [
        ...alerts.slice(0, 2),
        {
          title: this.title,
          subtitle: this.subtitle,
          status: AlertStatus.Dismissed,
        },
      ]),
    );
  }

  /* Fires when the onSubmit event is raised on an SnoozeAlert form. Displays default snooze form. */
  async onSnoozed(
    options: AlertOptions<AlertSnoozeFormData>,
  ): Promise<Alert[]> {
    const alerts = await this.api.getAlerts(options.group);
    return new Promise(resolve =>
      setTimeout(resolve, 750, [
        ...alerts.slice(0, 2),
        {
          title: this.title,
          subtitle: this.subtitle,
          status: AlertStatus.Snoozed,
        },
      ]),
    );
  }

  /* Fires when the onSubmit event is raised on an AcceptAlert form. Displays default accept form. */
  async onAccepted(options: AlertOptions<null>): Promise<Alert[]> {
    const alerts = await this.api.getAlerts(options.group);
    return new Promise(resolve =>
      setTimeout(resolve, 750, [
        ...alerts.slice(0, 2),
        {
          title: this.title,
          subtitle: this.subtitle,
          status: AlertStatus.Accepted,
        },
      ]),
    );
  }
}
