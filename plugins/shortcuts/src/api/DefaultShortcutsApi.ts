/*
 * Copyright 2021 The Backstage Authors
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

import { pageTheme } from '@backstage/theme';
import { v4 as uuid } from 'uuid';
import { ShortcutApi, type Shortcut } from '@backstage/plugin-shortcuts';
import type { StorageApi } from '@backstage/core-plugin-api';
import type { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';

/**
 * Default implementation of the {@link ShortcutApi} that uses the
 * {@link @backstage/core-plugin-api#StorageApi} to store shortcuts.
 *
 * @remarks
 *
 * Note that the storage API given is used directly, as in, this implementation
 * does not itself dive into a sub-bucket. So you may want to provide a bucket
 * that is scoped to the plugin (default: 'shortcuts').
 *
 * @public
 */
export class DefaultShortcutsApi implements ShortcutApi {
  private shortcuts: Shortcut[];
  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<Shortcut[]>
  >();

  private readonly observable = new ObservableImpl<Shortcut[]>(subscriber => {
    // forward the the latest value
    subscriber.next(this.shortcuts);

    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  });

  constructor(private readonly storageApi: StorageApi) {
    this.shortcuts = this.storageApi.snapshot<Shortcut[]>('items').value ?? [];
    this.storageApi.observe$<Shortcut[]>('items').subscribe({
      next: next => {
        this.shortcuts = next.value ?? [];
        this.notifyChanges();
      },
    });
  }

  shortcut$(): Observable<Shortcut[]> {
    return this.observable;
  }

  get() {
    return this.shortcuts;
  }

  async add(shortcut: Omit<Shortcut, 'id'>) {
    const shortcuts = this.sort([...this.get(), { ...shortcut, id: uuid() }]);

    await this.storageApi.set('items', shortcuts);
  }

  async remove(id: string) {
    const shortcuts = this.get().filter(s => s.id !== id);

    await this.storageApi.set('items', shortcuts);
  }

  async update(shortcut: Shortcut) {
    const shortcuts = this.get().filter(s => s.id !== shortcut.id);
    shortcuts.push(shortcut);

    await this.storageApi.set('items', shortcuts);
  }

  getColor(url: string) {
    const type = url.split('/')[1];
    const theme =
      this.THEME_MAP[type] ??
      (Object.keys(pageTheme).includes(type) ? type : 'tool');

    return pageTheme[theme].colors[0];
  }

  private readonly THEME_MAP: Record<string, keyof typeof pageTheme> = {
    catalog: 'home',
    docs: 'documentation',
  };

  private sort(shortcuts: Shortcut[]): Shortcut[] {
    return shortcuts.slice().sort((a, b) => (a.title >= b.title ? 1 : -1));
  }

  private notifyChanges() {
    for (const subscription of this.subscribers) {
      subscription.next(this.shortcuts);
    }
  }
}
