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

import { ChangeStatistic } from './ChangeStatistic';
import { Maybe } from './Maybe';

/**
 * Generic alert type with required fields for display. The `element` field will be rendered in
 * the Cost Insights "Action Items" section. This should use data fetched in the CostInsightsApi
 * implementation to render an InfoCard or other visualization.
 */
export type Alert = {
  title: string;
  subtitle: string;
  url?: string;
  buttonText?: string; // Default: View Instructions
  element: JSX.Element;
};

export interface AlertCost {
  id: string;
  aggregation: [number, number];
}

export interface ResourceData {
  previous: number;
  current: number;
  name: Maybe<string>;
}

export interface BarChartOptions {
  previousFill: string;
  currentFill: string;
  previousName: string;
  currentName: string;
}

/** deprecated use BarChartOptions instead */
export interface BarChartData extends BarChartOptions {}

export enum DataKey {
  Previous = 'previous',
  Current = 'current',
  Name = 'name',
}

export interface ProjectGrowthData {
  project: string;
  periodStart: string;
  periodEnd: string;
  aggregation: [number, number];
  change: ChangeStatistic;
  products: Array<AlertCost>;
}

export interface UnlabeledDataflowData {
  periodStart: string;
  periodEnd: string;
  projects: Array<UnlabeledDataflowAlertProject>;
  unlabeledCost: number;
  labeledCost: number;
}

export interface UnlabeledDataflowAlertProject {
  id: string;
  unlabeledCost: number;
  labeledCost: number;
}
