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

export { plugin } from './plugin';

/**
 * The API for configuring the Tech Radar in a Backstage deployment.
 */
export * from './api';

/**
 * Load sample data for Backstage users to get setup quickly.
 *
 * @example
 *   import { techRadarApiRef, TechRadar, loadSampleData } from '@backstage/plugin-tech-radar';
 *   builder.add(techRadarApiRef, new TechRadar(800, 500, loadSampleData));
 */
export { default as loadSampleData } from './sampleData';
