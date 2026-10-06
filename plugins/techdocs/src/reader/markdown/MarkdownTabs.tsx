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

import { ReactNode, useId, useState } from 'react';

export function MarkdownTabs({
  tabs,
}: {
  tabs: { title: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  return (
    <div>
      <div role="tablist" aria-label="Content tabs">
        {tabs.map((tab, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={event => {
              let next = i;
              if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
              else if (event.key === 'ArrowLeft')
                next = (i + tabs.length - 1) % tabs.length;
              else if (event.key === 'Home') next = 0;
              else if (event.key === 'End') next = tabs.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              document.getElementById(`${id}-tab-${next}`)?.focus();
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={i}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
