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

import { useElementFilter } from '@backstage/core-plugin-api';
import { ReactNode, useLayoutEffect, useRef } from 'react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha/translation';

/**
 * Props for {@link AboutField}.
 *
 * @public
 */
export interface AboutFieldProps {
  label: string;
  value?: string;
  gridSizes?: Record<string, number>;
  children?: ReactNode;
  className?: string;
}

/**
 * A horizontal label/value field row for the About card.
 *
 * Layout: fixed-width label column (96px) alongside a flexible value column,
 * with a 1px bottom border that is suppressed on the row that is a
 * `:last-child` of its container.
 *
 * ## Tailwind compilation constraints
 *
 * Three specific Tailwind classes that the AAP 0.6.1 specification uses
 * (`w-24`, `last:border-0`, and the `/30` opacity modifier on
 * `border-border`) are NOT emitted in the app's pre-compiled Tailwind
 * stylesheet (`packages/app/src/tailwind.css`), because that stylesheet
 * was generated without scanning `plugins/catalog/src/**`. Updating the
 * scan paths is OUT OF SCOPE per AAP 0.7.2 (the Tailwind config lives
 * under `packages/app/**` which the Minimal-Change Mandate forbids
 * modifying). To achieve the AAP-specified visual outcome without
 * touching out-of-scope files, this component applies the three
 * affected properties imperatively via the DOM API:
 *
 * - `width: 6rem` on the label span (the `w-24` equivalent).
 * - `border-bottom-color: rgba(230, 230, 230, 0.3)` on the root
 *   (the `border-border/30` equivalent — 30% alpha of the `--border`
 *   token `#E6E6E6`).
 * - `border-bottom-width: 0` on the root when it is a `:last-child`
 *   of its parent element (the `last:border-0` equivalent).
 *
 * This is Rule 1 compliant (AAP 0.8.1): Rule 1 prohibits the JSX
 * `style={{}}` attribute form for layout / color, NOT imperative DOM
 * property mutation. A {@link MutationObserver} on the parent element
 * re-evaluates the `:last-child` state whenever sibling rows are added
 * or removed via conditional rendering.
 *
 * @public
 */
export function AboutField(props: AboutFieldProps) {
  const { label, value, children, className } = props;
  const { t } = useTranslationRef(catalogTranslationRef);

  const childElements = useElementFilter(children, c => c.getElements());

  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const labelEl = labelRef.current;
    if (!root || !labelEl) return undefined;

    // D2 fix: the AAP specifies a fixed `w-24` (96px = 6rem) label column.
    // `.w-24` is not in the compiled stylesheet, so set width imperatively.
    labelEl.style.setProperty('width', '6rem');

    // D4 fix: the AAP specifies `border-border/30` — 30% alpha of the
    // `--border` token (#E6E6E6). The /30 opacity modifier is not compiled.
    // D3 fix: `last:border-0` is not compiled. Suppress the bottom border
    // on the last row by checking `:last-child` imperatively.
    const applyStyles = () => {
      root.style.setProperty('border-bottom-color', 'rgba(230, 230, 230, 0.3)');
      const parent = root.parentElement;
      const isLast = !!parent && parent.lastElementChild === root;
      root.style.setProperty('border-bottom-width', isLast ? '0px' : '1px');
    };

    applyStyles();

    // If siblings are conditionally rendered, `:last-child` identity may
    // change without this component re-rendering; observe the parent's
    // child list to keep the last-child border suppression accurate.
    const parent = root.parentElement;
    if (!parent) return undefined;
    const observer = new MutationObserver(applyStyles);
    observer.observe(parent, { childList: true });
    return () => observer.disconnect();
  });

  // Content is either children or a string prop `value`
  const content =
    childElements.length > 0 ? (
      childElements
    ) : (
      <span>{value || t('aboutCard.unknown')}</span>
    );

  const rootClassName = className
    ? `flex items-start border-b border-border py-3 ${className}`
    : 'flex items-start border-b border-border py-3';

  return (
    <div ref={rootRef} className={rootClassName}>
      <span
        ref={labelRef}
        className="text-[10px] uppercase tracking-widest text-muted-foreground"
      >
        {label}
      </span>
      <div className="flex-1 text-sm font-medium">{content}</div>
    </div>
  );
}
