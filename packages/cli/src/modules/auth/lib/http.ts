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

import fetch from 'cross-fetch';

type HttpInit = {
  headers?: Record<string, string>;
  method?: string;
  body?: any;
  signal?: AbortSignal;
};

export async function httpJson<T>(url: string, init?: HttpInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `HTTP ${res.status}: ${res.statusText}${text ? ` - ${text}` : ''}`,
      );
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export async function httpForm(
  url: string,
  body: Record<string, string>,
  init?: HttpInit,
): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(init?.headers ?? {}),
      },
      body: new URLSearchParams(body).toString(),
      signal: controller.signal,
      ...init,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(
        `HTTP ${res.status}: ${res.statusText}${text ? ` - ${text}` : ''}`,
      );
    }
  } finally {
    clearTimeout(timeout);
  }
}
