/*
 * Copyright 2026 The Backstage Authors
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

import { useEffect, useRef } from 'react';
import { EntitySelectionOption } from './useEntityRefCandidates';

/** Keep selected rows and their positions for the lifetime of an open picker. */
export function useStableSelectionRows(props: {
  rows: EntitySelectionOption[];
  selections: EntitySelectionOption[];
  search: string;
  open: boolean;
}) {
  const { rows, selections, search, open } = props;
  const session = useRef({
    initialRefs: [] as string[],
    selections: new Map<string, EntitySelectionOption>(),
    search: '',
    order: [] as string[],
  });
  const retained = new Map([
    ...session.current.selections,
    ...selections.map(item => [item.ref, item] as const),
  ]);
  const incoming = new Map(rows.map(item => [item.ref, item]));
  const matches = (item: EntitySelectionOption) =>
    `${item.label} ${item.ref}`
      .toLocaleLowerCase('en-US')
      .includes(search.trim().toLocaleLowerCase('en-US'));
  const visible = new Map<string, EntitySelectionOption>();
  for (const ref of session.current.initialRefs) {
    const item = incoming.get(ref) ?? retained.get(ref);
    if (item && (incoming.has(ref) || matches(item))) visible.set(ref, item);
  }
  for (const item of rows) visible.set(item.ref, item);
  for (const item of retained.values()) {
    if (!visible.has(item.ref) && matches(item)) visible.set(item.ref, item);
  }
  const ranks = new Map(
    (session.current.search === search ? session.current.order : []).map(
      (ref, index) => [ref, index],
    ),
  );
  const items = Array.from(visible.values()).sort(
    (a, b) =>
      (ranks.get(a.ref) ?? ranks.size) - (ranks.get(b.ref) ?? ranks.size),
  );
  useEffect(() => {
    if (!open) return;
    // Only remember selections, plus the current result order, not every search.
    for (const item of selections)
      session.current.selections.set(item.ref, item);
    session.current.search = search;
    session.current.order = items.map(item => item.ref);
  });

  return {
    items,
    beginSession() {
      session.current = {
        initialRefs: selections.map(item => item.ref),
        selections: new Map(selections.map(item => [item.ref, item])),
        search,
        order: [],
      };
    },
  };
}
