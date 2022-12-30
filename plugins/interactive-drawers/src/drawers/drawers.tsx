/*
 * Copyright 2022 The Backstage Authors
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

import React, { useMemo, useState, useRef, useCallback } from 'react';

import { useClickAway } from 'react-use';

import { DrawerPane } from './drawer-pane';
import { commonSizes } from './types';

import { useSidebarRoot } from '../contexts';
import { useStyles } from './styles';

export function Drawers() {
  const { extraDrawerHolder } = useStyles();
  const { interactiveDrawers, setInteractiveDrawers } = useSidebarRoot();

  const ref = useRef(null);
  useClickAway(ref, () => {
    setInteractiveDrawers(drawers => {
      if (drawers.length > 0) {
        drawers[0].content = undefined;
        return drawers.slice(0, 1);
      }
      return [];
    });
  });

  const [widths, setWidths] = useState<number[]>([]);

  const onSize = useCallback((width: number, index: number) => {
    setWidths(oldWidths => {
      const ret = [...oldWidths];

      while (ret.length < index - 1) {
        ret.push(0);
      }

      if (ret.length > index) {
        ret[index] = width;
      } else if (ret.length === index) {
        ret.push(width);
      }

      return ret;
    });
  }, []);

  if (widths.length > interactiveDrawers.length) {
    // Remove old unused widths. Can mutate state, it doesn't matter.
    widths.splice(
      interactiveDrawers.length,
      widths.length - interactiveDrawers.length,
    );
  }

  const lefts = useMemo(
    () =>
      widths.map((_, i) => {
        let w = commonSizes.panelMargin;
        for (let j = 0; j < i; ++j) {
          w += widths[j] + commonSizes.panelMargin;
        }
        return w;
      }),
    [widths],
  );

  return (
    <div ref={ref} className={extraDrawerHolder}>
      {interactiveDrawers
        .map((drawer, i) => (
          <DrawerPane
            key={drawer.key}
            drawer={drawer}
            index={i}
            left={lefts[i]}
            onSize={onSize}
          />
        ))
        .reverse()}
    </div>
  );
}
