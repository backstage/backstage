/*
 * Copyright 2021 The Backstage Authors
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

/**
 * Query parameters for listing DAGs
 */
export interface ListDagsParams {
  limit?: number;
  offset?: number;
  order_by?: string;
  tags?: Tag[];
  only_active?: boolean;
}

export interface Dags {
  dags: Dag[];
  total_entries: number;
}

export interface Dag {
  dag_id: string;
  root_dag_id?: string;
  is_paused?: boolean;
  is_active?: boolean;
  is_subdag?: boolean;
  fileloc: string;
  file_token: string;
  owners: string[];
  description?: string;
  schedule_interval: ScheduleInterval;
  tags: Tag[];
}

export interface DagRun {
  dag_run_id: string;
  dag_id: string;
  logical_date: string;
  start_date: string;
  end_date: string;
  state: 'queued' | 'running' | 'success' | 'failed';
  external_trigger: boolean;
  conf: {};
}

export interface TimeDelta {
  __type: 'TimeDelta';
  days: number;
  seconds: number;
  microseconds: number;
}

export interface RelativeDelta {
  __type: 'RelativeDelta';
  years: number;
  months: number;
  days: number;
  leapdays: number;
  hours: number;
  minutes: number;
  seconds: number;
  microseconds: number;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  microsecond: number;
}

export interface CronExpression {
  __type: 'CronExpression';
  value: string;
}

// discrimant union of possible schedule interval types
export type ScheduleInterval = TimeDelta | RelativeDelta | CronExpression;

export interface Tag {
  name: string;
}
