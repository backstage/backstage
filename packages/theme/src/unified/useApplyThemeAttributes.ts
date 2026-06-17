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

import { useEffect } from 'react';

type ThemeFrame = { mode?: string; name?: string };

const STACK_ATTR = 'data-unified-theme-stack';
const MODE_ATTR = 'data-theme-mode';
const NAME_ATTR = 'data-theme-name';

function mutateAttrStack(mutator: (stack: ThemeFrame[]) => void) {
  const stack = (() => {
    const raw = document.body.getAttribute(STACK_ATTR);
    if (!raw) {
      return [] as ThemeFrame[];
    }
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as ThemeFrame[]) : [];
    } catch {
      return [] as ThemeFrame[];
    }
  })();

  mutator(stack);

  if (stack.length === 0) {
    document.body.removeAttribute(STACK_ATTR);
  } else {
    document.body.setAttribute(STACK_ATTR, JSON.stringify(stack));
  }

  const top = stack[stack.length - 1];
  if (top?.mode) {
    document.body.setAttribute(MODE_ATTR, String(top.mode));
  } else {
    document.body.removeAttribute(MODE_ATTR);
  }
  if (top?.name) {
    document.body.setAttribute(NAME_ATTR, String(top.name));
  } else {
    document.body.removeAttribute(NAME_ATTR);
  }
}

export function useApplyThemeAttributes(themeMode: string, themeName: string) {
  useEffect(() => {
    mutateAttrStack(stack => {
      stack.push({ mode: themeMode, name: themeName });
    });

    return () => {
      mutateAttrStack(stack => {
        stack.pop();
      });
    };
  }, [themeMode, themeName]);
}
