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
import { NotificationSettings } from './types';

/** @public */
export const isNotificationsEnabledFor = (
  settings: NotificationSettings,
  channelId: string,
  originId: string,
  topicId: string | null,
) => {
  const channel = settings.channels.find(c => c.id === channelId);
  if (!channel) {
    return true;
  }

  const origin = channel.origins.find(o => o.id === originId);
  if (!origin) {
    // If no origin is found, use channel's enabled flag (defaults to true if not set)
    return channel.enabled ?? true;
  }

  // If topic is specified, check topic-level setting
  if (topicId !== null) {
    const topic = origin.topics?.find(t => t.id === topicId);
    if (topic) {
      return topic.enabled;
    }
    // No explicit topic setting, check origin
    return origin.enabled;
  }

  // No topic specified, check origin-level setting
  return origin.enabled;
};
