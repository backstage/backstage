/*
 * Copyright 2024 The Backstage Authors
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

import React from 'react';
import { useApp } from '@backstage/core-plugin-api';
import { useVersionedContext } from '@backstage/version-bridge';

import {
  coreComponentRefs,
  useComponentRef,
} from '@backstage/frontend-plugin-api';

function LegacyAppProgress() {
  const app = useApp();
  const { Progress } = app.getComponents();
  return <Progress />;
}

function NewAppProgress() {
  const Progress = useComponentRef(coreComponentRefs.progress);
  return <Progress />;
}

export function CompatAppProgress() {
  const isInNewApp = !useVersionedContext<{ 1: unknown }>('app-context');
  return isInNewApp ? <NewAppProgress /> : <LegacyAppProgress />;
}
