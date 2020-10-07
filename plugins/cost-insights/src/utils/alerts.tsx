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
import { Alert, AlertType, assertNever } from '../types';
import ProjectGrowthAlertCard from '../components/ProjectGrowthAlertCard';
import UnlabeledDataflowAlertCard from '../components/UnlabeledDataflowAlertCard';

export function getAlertText(alert: Alert) {
  switch (alert.id) {
    case AlertType.ProjectGrowth:
      return {
        title: `Investigate cost growth in project ${alert.project}`,
        subtitle:
          'Cost growth outpacing business growth is unsustainable long-term.',
      } as AlertText;
    case AlertType.UnlabeledDataflow:
      return {
        title: 'Add labels to workflows',
        subtitle:
          'Labels show in billing data, enabling cost insights for each workflow.',
      };
    default:
      return assertNever(alert);
  }
}

export function getAlertUrl(alert: Alert) {
  switch (alert.id) {
    case AlertType.ProjectGrowth:
      return '/cost-insights/investigating-growth' as AlertUrl;
    case AlertType.UnlabeledDataflow:
      return '/cost-insights/labeling-jobs' as AlertUrl;
    default:
      return assertNever(alert);
  }
}

export function getAlertButtonText(alert: Alert) {
  switch (alert.id) {
    case AlertType.ProjectGrowth:
    case AlertType.UnlabeledDataflow:
      return 'View Instructions' as AlertButtonText;
    default:
      return assertNever(alert);
  }
}

export function getAlertNavigation(alert: Alert, number: number) {
  return `${alert.id}-${number}`;
}

export function renderAlert(alert: Alert) {
  switch (alert.id) {
    case AlertType.ProjectGrowth:
      return <ProjectGrowthAlertCard alert={alert} />;
    case AlertType.UnlabeledDataflow:
      return <UnlabeledDataflowAlertCard alert={alert} />;
    default:
      return assertNever(alert);
  }
}

export type AlertUrl = string;
export type AlertButtonText = string;

export interface AlertText {
  title: string;
  subtitle: string;
}
