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
  const { label, value, children, className } = props;
  const { t } = useTranslationRef(catalogTranslationRef);

  const childElements = useElementFilter(children, c => c.getElements());

  // Content is either children or a string prop `value`
  const content =
    childElements.length > 0 ? (
      childElements
    ) : (
      <span>{value || t('aboutCard.unknown')}</span>
    );

  const rootClassName = className
    ? `flex items-start border-b border-border/30 last:border-0 py-3 ${className}`
    : 'flex items-start border-b border-border/30 last:border-0 py-3';

  return (
    <div className={rootClassName}>
      <span className="w-24 text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="flex-1 text-sm font-medium">{content}</div>
    </div>
  );
}
