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

export type Alert = ProjectGrowthAlert | UnlabeledDataflowAlert;

export interface AlertProps {
  alert: Alert;
}

export enum AlertType {
  ProjectGrowth = 'projectGrowth',
  UnlabeledDataflow = 'unlabeledDataflow',
}

export interface AlertCost {
  id: string;
  aggregation: [number, number];
}

export interface ResourceData {
  previous: number;
  current: number;
  name: Maybe<string>;
}

export interface BarChartData {
  previousFill: string;
  currentFill: string;
  previousName: string;
  currentName: string;
}

export enum DataKey {
  Previous = 'previous',
  Current = 'current',
  Name = 'name',
}

export interface ProjectGrowthAlert {
  id: AlertType.ProjectGrowth;
  project: string;
  periodStart: string;
  periodEnd: string;
  aggregation: [number, number];
  change: ChangeStatistic;
  products: Array<AlertCost>;
}

export interface UnlabeledDataflowAlert {
  id: AlertType.UnlabeledDataflow;
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
