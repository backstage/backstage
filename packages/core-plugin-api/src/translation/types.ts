/*
 * Copyright 2023 The Backstage Authors
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

/** @alpha */
export interface TranslationRefConfig<
  Messages extends Record<keyof Messages, string>,
> {
  id: string;
  messages: Messages;
  lazyResources?: Record<string, () => Promise<{ messages: Messages }>>;
  resources?: Record<string, Messages>;
}

/** @alpha */
export interface TranslationRef<
  Messages extends Record<keyof Messages, string> = Record<string, string>,
> {
  getId(): string;

  getDefaultMessages(): Messages;

  getResources(): Record<string, Messages> | undefined;

  getLazyResources():
    | Record<string, () => Promise<{ messages: Messages }>>
    | undefined;
}

/** @alpha */
export type TranslationOptions<
  Messages extends Record<keyof Messages, string> = Record<string, string>,
> = Messages;
