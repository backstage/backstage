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
import { ShortcutApi } from './ShortcutApi';
import { Shortcut } from '../types';
import { StorageApi } from '@backstage/core-plugin-api';
import Observable from 'zen-observable';

/**
 * Implementation of the ShortcutApi that uses the StorageApi to store shortcuts.
 *
 * @public
 */
export class LocalStoredShortcuts implements ShortcutApi {
  private readonly shortcuts: Observable<Shortcut[]>;

  constructor(private readonly storageApi: StorageApi) {
    this.shortcuts = Observable.from(
      this.storageApi.observe$<Shortcut[]>('items'),
    ).map(snapshot => snapshot.value ?? []);
  }

  shortcut$() {
    return this.shortcuts;
  }

  get() {
    return Array.from(
      this.storageApi.snapshot<Shortcut[]>('items').value ?? [],
    ).sort((a, b) => (a.title >= b.title ? 1 : -1));
  }

  async add(shortcut: Omit<Shortcut, 'id'>) {
    const shortcuts = this.get();
    shortcuts.push({ ...shortcut, id: uuid() });

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
}
