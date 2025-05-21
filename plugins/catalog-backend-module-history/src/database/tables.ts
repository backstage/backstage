/*
 * Copyright 2024 The Backstage Authors
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

export interface EventsTableRow {
  event_id: string;
  event_at: Date | string;
  event_type: string;
  entity_ref: string | null;
  entity_id: string | null;
  entity_json: string | null;
}

export interface SubscriptionsTableRow {
  subscription_id: string;
  created_at: Date | string;
  active_at: Date | string;
  state: 'idle' | 'waiting';
  ack_id: string | null;
  ack_timeout_at: Date | string | null;
  last_acknowledged_event_id: number | string;
  last_sent_event_id: number | string;
  filter_entity_ref: string | null;
  filter_entity_id: string | null;
}
