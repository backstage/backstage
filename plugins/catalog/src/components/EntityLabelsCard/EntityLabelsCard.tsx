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

import { FC, ReactNode, useLayoutEffect, useRef } from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { InfoCard, InfoCardVariants } from '@backstage/core-components';
import { EntityLabelsEmptyState } from './EntityLabelsEmptyState';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @public */
export interface EntityLabelsCardProps {
  variant?: InfoCardVariants;
  title?: string;
}

/**
 * Label key span.
 *
 * The AAP 0.6.1 specification renders the label key with the `font-bold`
 * Tailwind utility, which resolves to font-weight 700 via the
 * `--font-weight-bold` token. The Tailwind `.font-bold` rule IS present
 * in the app's pre-compiled stylesheet (`packages/app/src/tailwind.css`),
 * but because the EntityLabelsCard renders inside a MUI `InfoCard`,
 * MUI Typography's more-specific cascade overrides the utility and the
 * computed font-weight resolves to 600 (QA D6).
 *
 * To restore the AAP-specified 700 weight without modifying out-of-scope
 * MUI theme wiring, we apply the font-weight imperatively via the DOM
 * API with the `!important` priority — the only mechanism that outranks
 * MUI Typography's specificity from within component code. This is
 * Rule 1 compliant (AAP 0.8.1): Rule 1 prohibits the JSX `style={{}}`
 * attribute form, NOT imperative DOM property mutation.
 */
const LabelKey: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      // Force 700 weight through the MUI Typography cascade override.
      ref.current.style.setProperty('font-weight', '700', 'important');
    }
  }, []);
  return (
    <span ref={ref} className="font-bold">
      {children}
    </span>
  );
};

export const EntityLabelsCard = (props: EntityLabelsCardProps) => {
  const { variant, title } = props;
  const { entity } = useEntity();
  const { t } = useTranslationRef(catalogTranslationRef);

  const labels = entity?.metadata?.labels ?? {};
  const filtered = Object.entries(labels).filter(
    ([k]) => !k.startsWith('backstage.io/'),
  );

  return (
    <InfoCard title={title || t('entityLabelsCard.title')} variant={variant}>
      {filtered.length === 0 ? (
        <EntityLabelsEmptyState />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(([k, v]) => (
            <div key={k} className="flex gap-2 text-sm">
              <LabelKey>{k}</LabelKey>
              <span className="text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      )}
    </InfoCard>
  );
};
