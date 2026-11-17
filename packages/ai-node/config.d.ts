/*
 * Copyright 2026 The Backstage Authors
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
 * The managed AI service defines no configuration of its own at a fixed path.
 *
 * @remarks
 *
 * Every consuming plugin explicitly chooses where its AI configuration lives
 * in app-config and passes the root config plus that path to `openHarness`;
 * there is no required `ai.*`, `ai.plugins.*`, or `<pluginId>.ai` namespace.
 * The schema at a plugin-selected path is:
 *
 * ```yaml
 * <plugin-chosen-path>:
 *   mode: service | interactive
 *   model:
 *     provider: <provider-id>
 *     modelId: <model-id>
 *   thinkingLevel: off | minimal | low | medium | high | xhigh | max
 * ```
 *
 * `mode: service` requires `model.provider` and `model.modelId`. Provider
 * credential configuration and key material are installation-scoped and are
 * validated separately by the service factory in a later wave.
 */
export interface Config {}
