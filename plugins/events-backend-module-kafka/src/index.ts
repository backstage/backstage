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
import { createBackendFeatureLoader } from '@backstage/backend-plugin-api';
import { eventsModuleKafkaConsumingEventPublisher } from './KafkaConsumingEventPublisher';
import { eventsModuleKafkaPublishingEventConsumer } from './KafkaPublishingEventConsumer';

/**
 * The module "kafka" for the Backstage backend plugin "events"
 * adding Kafka-based event handling:
 * - Consumer: receives events from Kafka topics and passes them to the internal event broker
 * - Publisher: receives internal events and publishes them to Kafka topics
 *
 * @packageDocumentation
 */

export default createBackendFeatureLoader({
  *loader() {
    yield eventsModuleKafkaConsumingEventPublisher;
    yield eventsModuleKafkaPublishingEventConsumer;
  },
});
