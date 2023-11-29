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
import { useState } from 'react';

import { CartCoord, Entry } from '../../../types';

import { adjustEntrySpacing } from './entries';

export function useEntryLayout(visibleEntries: Entry[], hasActiveQuadrant: boolean) {
  const [lastSimulation, setLastSimulation] = useState<Map<string, CartCoord>>(new Map());

  if (visibleEntries.length !== lastSimulation.size || !visibleEntries.every(e => lastSimulation.has(e.id))) {
    const simulatedEntries = adjustEntrySpacing(visibleEntries, { giveSpaceForLabels: !hasActiveQuadrant });
    setLastSimulation(new Map(simulatedEntries.map(e => [e.id, { x: e.x, y: e.y }])));
  }

  return visibleEntries.map(entry => ({
    ...entry,
    ...lastSimulation.get(entry.id),
  }));
}
