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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { UIEvent, useEffect, useRef, useState } from 'react';

/** Pagination for MUI's virtualized, selection-filtered listbox. */
export function useEntityPickerPagination(options: {
  entities: Entity[];
  selectedEntityRefs: string[];
  loading: boolean;
  loadMore: () => void;
}) {
  const { entities, selectedEntityRefs, loading, loadMore } = options;
  const [open, setOpen] = useState(false);
  const lastAutomaticRequest = useRef<{
    entities: Entity[];
    selectedEntityRefs: string[];
  }>();

  useEffect(() => {
    if (!open || loading) return;
    if (
      lastAutomaticRequest.current?.entities === entities &&
      lastAutomaticRequest.current?.selectedEntityRefs === selectedEntityRefs
    )
      return;

    const available = entities.filter(
      entity => !selectedEntityRefs.includes(stringifyEntityRef(entity)),
    );
    // The list shows up to 10.5 rows. Selected options may hide a whole page,
    // in which case MUI doesn't even mount the listbox to receive scroll events.
    if (available.length <= 10) {
      // Only try once per page/selection, so failures don't cause a retry loop.
      // Scrolling or reopening the menu allows the user to retry.
      lastAutomaticRequest.current = { entities, selectedEntityRefs };
      loadMore();
    }
  }, [entities, selectedEntityRefs, loading, loadMore, open]);

  return {
    onOpen: () => {
      lastAutomaticRequest.current = undefined;
      setOpen(true);
    },
    onClose: () => setOpen(false),
    ListboxProps: {
      onScroll: (event: UIEvent<HTMLElement>) => {
        const element = event.currentTarget;
        // Keyboard navigation leaves some padding below the last visible row.
        if (
          element.scrollHeight - element.clientHeight - element.scrollTop <=
          36
        ) {
          loadMore();
        }
      },
    },
  };
}
