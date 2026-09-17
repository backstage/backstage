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

import { defaultConfigLoader } from '@backstage/core-app-api';

const PRODUCTION_CONFIG = {
  backend: {
    baseUrl: 'http://localhost:3000',
  },
  techdocs: {
    builder: 'external',
  },
};

const DEVELOPMENT_CONFIG = {
  backend: {
    baseUrl: 'http://localhost:7007',
  },
  techdocs: {
    builder: 'external',
  },
};

async function isProductionServe() {
  const res = await fetch('/.detect');
  if (!res.ok) {
    return false;
  }
  const text = await res.text();
  return text.trim() === 'techdocs-cli-server';
}

export async function configLoader() {
  const defaultConfigs = await defaultConfigLoader();
  const isProduction = await isProductionServe();

  return [
    ...defaultConfigs,
    {
      context: 'detected',
      data: isProduction ? PRODUCTION_CONFIG : DEVELOPMENT_CONFIG,
    },
  ];
}
