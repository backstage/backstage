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
 * The alert below is an example of an Alert implementation using event hooks.
 *
 * Alerts can be customized to be accepted, dismissed snoozed or any combination
 * by defining a corresponding hook on the alert instance.
 *
 * For example, defining an onDismissed hook will render a dismiss button that, when clicked, will
 * generate a dialog prompting the user to provide a reason for dismissing the alert.
 * Dismiss form data will be passed to the hook, which must eventually return a new set of alerts.
 * Errors thrown within hooks will generate a snackbar, which can be used to display a
 * user-friendly error message.
 *
 * Cost Insights provides default forms for each hook, which can be overriden by providing a custom form component.
 */

export class KubernetesMigrationAlert implements MigrationAlert {
  api: CostInsightsApi;
  data: MigrationData;

  subtitle =
    'Services running on Kubernetes are estimated to save 50% or more compared to Compute Engine.';

  // Override default dismiss form with custom form component.
  // SnoozeForm: AlertForm<MigrationAlert, MigrationSnoozeFormData> = MigrationSnoozeForm;
  // AcceptForm: AlertForm<MigrationAlert, MigrationAcceptFormData> = MigrationAcceptForm;
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

  /* Displays a custom dismiss form. */
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
          /**
           * If a status property is defined, the alert will be filtered from the action items list
           * but still appear grouped with other action items of the same status in the Hidden Action Items section.
           */
          status: AlertStatus.Dismissed,
        },
      ]),
    );
  }

  /* Displays default accept form. */
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

  /* Displays default accept form. */
  async onAccepted(options: AlertOptions): Promise<Alert[]> {
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
