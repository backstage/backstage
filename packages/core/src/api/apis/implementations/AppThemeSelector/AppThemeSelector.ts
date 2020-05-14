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

import Observable from 'zen-observable';
import { AppThemeApi, AppTheme } from '../../definitions';

const STORAGE_KEY = 'theme';

export class AppThemeSelector implements AppThemeApi {
  static createWithStorage(themes: AppTheme[]) {
    const selector = new AppThemeSelector(themes);

    const initialThemeId =
      window?.localStorage.getItem(STORAGE_KEY) ?? undefined;

    selector.setActiveThemeId(initialThemeId);

    selector.activeThemeId$().subscribe((themeId) => {
      if (themeId) {
        window?.localStorage.setItem(STORAGE_KEY, themeId);
      } else {
        window?.localStorage.removeItem(STORAGE_KEY);
      }
    });

    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY) {
        const themeId = localStorage.getItem(STORAGE_KEY) ?? undefined;
        selector.setActiveThemeId(themeId);
      }
    });

    return selector;
  }

  private readonly themes: AppTheme[];

  private activeThemeId: string | undefined;

  private readonly observable: Observable<string | undefined>;
  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<string | undefined>
  >();

  constructor(themes: AppTheme[]) {
    this.themes = themes;

    this.observable = new Observable((subscriber) => {
      subscriber.next(this.activeThemeId);

      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });
  }

  getInstalledThemes(): AppTheme[] {
    return this.themes.slice();
  }

  activeThemeId$(): Observable<string | undefined> {
    return this.observable;
  }

  getActiveThemeId(): string | undefined {
    return this.activeThemeId;
  }

  setActiveThemeId(themeId?: string): void {
    this.activeThemeId = themeId;
    this.subscribers.forEach((subscriber) => subscriber.next(themeId));
  }
}
