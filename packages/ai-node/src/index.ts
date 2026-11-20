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
 * Managed AI service primitives for Backstage backend plugins.
 *
 * @remarks
 *
 * The entire surface of this package is coupled to the experimental
 * `@earendil-works/pi-durable` engine, so it is exposed as alpha from
 * `@backstage/ai-node/alpha` while the compatibility policy is not explicit.
 * The main entrypoint deliberately exposes nothing: install the
 * plugin-scoped `aiServiceRef` and use the managed primitive through the
 * alpha entrypoint.
 *
 * @packageDocumentation
 * @alpha
 */

export {};
