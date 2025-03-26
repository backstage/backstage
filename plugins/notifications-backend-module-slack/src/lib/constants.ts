/*
 * Copyright 2025 The Backstage Authors
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
 * @public
 * The annotation key for the entity's Slack ID. This can be
 * any valid chat.postMessage destination including:
 * - A user ID (U12345678)
 * - A channel ID (C12345678)
 * - A DM ID (D12345678)
 * - A group ID (S12345678)
 *
 * It can also be a user's email address or a channel name,
 * however IDs are preferred.
 */
export const ANNOTATION_SLACK_BOT_NOTIFY = 'slack.com/bot-notify';
