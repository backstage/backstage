/*
 * Copyright 2020 The Backstage Authors
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

import { ApiRef, createApiRef } from '../system';
import { Observable } from '@backstage/types';
import { InitOptions, Resource, i18n } from 'i18next';
import { Locals } from '../../translation';

export type { Resource, i18n } from 'i18next';

export type LocalConfig = InitOptions & {
  lazyResources?: () => Promise<Resource>;
  languageOptions?: Set<string> | string[];
};

/**
 * The AppTranslationApi gives access to the current app i18next, and allows switching
 * to other options that have been registered as a part of the App.
 *
 * @public
 */
export type AppTranslationApi = {
  instance: i18n;
  /**
   * Get a instance of i18next.
   */
  getI18next(): i18n;

  /**
   * Get all support languages
   */
  getLanguages(): string[];

  /**
   * Observe the currently language.
   */
  activeLanguage$(): Observable<string>;

  /**
   * Get the current language.
   */
  getActiveLanguage(): string;

  /**
   * Set a specific language to use in the app, overriding the default language selection.
   */
  setActiveLanguage(lng?: string): void;

  /**
   * add namespaced locals resource to i18next instance
   */
  addResources(locals: Locals, ns: string): void;
};

/**
 * The {@link ApiRef} of {@link AppTranslationApi}.
 *
 * @public
 */
export const appTranslationApiRef: ApiRef<AppTranslationApi> = createApiRef({
  id: 'core.app.translation',
});
