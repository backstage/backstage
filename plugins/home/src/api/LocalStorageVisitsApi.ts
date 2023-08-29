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
import { Visit } from './VisitsApi';
import { VisitsApiFactory } from './VisitsApiFactory';

/**
 * @public
 * This is a reference implementation of VisitsApi using window.localStorage.
 */
export class LocalStorageVisitsApi extends VisitsApiFactory {
  private readonly localStorage: Window['localStorage'];
  private readonly storageKey = '@backstage/plugin-home:visits';

  constructor({
    localStorage = window?.localStorage,
    randomUUID = window?.crypto?.randomUUID,
    limit = 100,
  }: {
    localStorage?: Window['localStorage'];
    randomUUID?: Window['crypto']['randomUUID'];
    limit?: number;
  } = {}) {
    super({ randomUUID, limit });
    this.localStorage = localStorage;
    this.retrieveAll = async (): Promise<Array<Visit>> => {
      let visits: Array<Visit>;
      try {
        visits = JSON.parse(this.localStorage.getItem(this.storageKey) ?? '[]');
      } catch {
        visits = [];
      }
      return visits;
    };
    this.persistAll = async (visits: Array<Visit>) => {
      this.localStorage.setItem(
        this.storageKey,
        JSON.stringify(visits.splice(0, this.limit)),
      );
    };
  }
}
