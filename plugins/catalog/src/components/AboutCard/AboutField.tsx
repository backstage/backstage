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
import { ReactNode } from 'react';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogTranslationRef } from '../../alpha/translation';
import { cn } from '@backstage/core-components';

/**
 * Converts MUI Grid breakpoint-based column sizes to Tailwind CSS
 * responsive col-span utility classes.
 *
 * @remarks
 * MUI Grid uses `xs`, `sm`, `md`, `lg`, `xl` props with 1-12 column spans.
 * Tailwind uses `col-span-{n}` with responsive prefixes (`sm:`, `md:`, etc.).
 * The `xs` breakpoint maps to the base (un-prefixed) class since Tailwind is
 * mobile-first.
 *
 * @param gridSizes - Optional record of breakpoint keys to column span numbers
 * @returns A space-separated string of Tailwind col-span classes
 */
function gridSizesToClassName(gridSizes?: Record<string, number>): string {
  if (!gridSizes) return 'col-span-12 sm:col-span-6 lg:col-span-4';
  const mapping: Record<string, string> = {
    xs: 'col-span',
    sm: 'sm:col-span',
    md: 'md:col-span',
    lg: 'lg:col-span',
    xl: 'xl:col-span',
  };
  return Object.entries(gridSizes)
    .map(([breakpoint, span]) => {
      const prefix = mapping[breakpoint];
      return prefix ? `${prefix}-${span}` : '';
    })
    .filter(Boolean)
    .join(' ');
}

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

/** @public */
export function AboutField(props: AboutFieldProps) {
  const { label, value, gridSizes, children, className } = props;
  const { t } = useTranslationRef(catalogTranslationRef);

  const childElements = useElementFilter(children, c => c.getElements());

  // Content is either children or a string prop `value`
  const content =
    childElements.length > 0 ? (
      childElements
    ) : (
      <p className="text-sm font-bold overflow-hidden leading-6 break-words">
        {value || t('aboutCard.unknown')}
      </p>
    );
  return (
    <div className={cn(gridSizesToClassName(gridSizes), className)}>
      <h2 className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.5px] overflow-hidden whitespace-nowrap">
        {label}
      </h2>
      {content}
    </div>
  );
}
