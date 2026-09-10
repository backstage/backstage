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

import { useEffect, useRef, useState } from 'react';
import { EntitySelectionOption } from './entitySelectionOptions';

type Snapshot = { rows: EntitySelectionOption[]; search: string };

/** Only a committed result or reopening may change the displayed rows. */
export function useStableSelectionRows(props: {
  snapshot: Snapshot;
  selections: EntitySelectionOption[];
  open: boolean;
}) {
  const { snapshot, selections, open } = props;
  const [items, setItems] = useState<EntitySelectionOption[]>([]);
  const session = useRef({
    source: snapshot,
    initialRefs: [] as string[],
    selections: new Map<string, EntitySelectionOption>(),
    search: '',
    order: [] as string[],
  });
  const publish = (next: Snapshot) => {
    const current = session.current;
    const incoming = new Map(next.rows.map(row => [row.ref, row]));
    const visible = new Map<string, EntitySelectionOption>();
    for (const ref of current.initialRefs) {
      const item =
        incoming.get(ref) ??
        (!next.search ? current.selections.get(ref) : undefined);
      if (item) visible.set(ref, item);
    }
    for (const row of next.rows) visible.set(row.ref, row);
    // An unfiltered list includes remembered selections. A search uses exactly
    // the server results and resolved candidates, with no client text matching.
    if (!next.search)
      for (const row of current.selections.values()) {
        if (!visible.has(row.ref)) visible.set(row.ref, row);
      }
    const ranks = new Map(
      (current.search === next.search ? current.order : []).map(
        (ref, index) => [ref, index],
      ),
    );
    const rows = [...visible.values()].sort(
      (a, b) =>
        (ranks.get(a.ref) ?? ranks.size) - (ranks.get(b.ref) ?? ranks.size),
    );
    current.search = next.search;
    current.order = rows.map(row => row.ref);
    setItems(rows);
  };
  useEffect(() => {
    if (!open) return;
    for (const item of selections)
      session.current.selections.set(item.ref, item);
    if (session.current.source !== snapshot) {
      session.current.source = snapshot;
      publish(snapshot);
    }
  });
  return {
    items,
    beginSession() {
      session.current = {
        source: snapshot,
        initialRefs: selections.map(item => item.ref),
        selections: new Map(selections.map(item => [item.ref, item])),
        search: '',
        order: [],
      };
      publish(snapshot.search ? { rows: [], search: '' } : snapshot);
    },
  };
}
