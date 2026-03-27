/*
 * Copyright 2023 The Backstage Authors
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

import { Fragment } from 'react';
import { EntityContentLayoutProps } from '@backstage/plugin-catalog-react/alpha';
import { EntitySwitch } from '../components/EntitySwitch';
import {
  EntityOrphanWarning,
  isOrphan,
} from '../components/EntityOrphanWarning';
import {
  EntityRelationWarning,
  hasRelationWarnings,
} from '../components/EntityRelationWarning';
import {
  EntityProcessingErrorsPanel,
  hasCatalogProcessingErrors,
} from '../components/EntityProcessingErrorsPanel';
import { HorizontalScrollGrid, cn } from '@backstage/core-components';

// Module-level flag to ensure deprecation warning is only logged once
let hasLoggedSummaryWarning = false;

export function DefaultEntityContentLayout(props: EntityContentLayoutProps) {
  const { cards } = props;

  const infoCards = cards.filter(card => card.type === 'info');
  // Keep support for 'summary' type at runtime for backward compatibility
  // even though it's been removed from the type system
  const summaryCards = cards.filter(card => card.type === ('summary' as any));
  const contentCards = cards.filter(
    card => !card.type || card.type === 'content',
  );

  if (summaryCards.length > 0 && !hasLoggedSummaryWarning) {
    hasLoggedSummaryWarning = true;
    // eslint-disable-next-line no-console
    console.warn(
      "The 'summary' entity card type has been removed. Please update your cards to use 'content' or 'info' types instead.",
    );
  }

  // Compute dynamic grid template values for md+ responsive breakpoint.
  // These are used via inline style because grid-template-areas/columns
  // are determined by which card types are present in the layout.
  const hasInfoCards = infoCards.length > 0;
  const hasSummaryCards = summaryCards.length > 0;

  return (
    <>
      {/* Warning area: flex column with gap, collapses when empty */}
      <div className="flex flex-col gap-4 mb-6 empty:mb-0 empty:hidden">
        <EntitySwitch>
          <EntitySwitch.Case if={isOrphan}>
            <EntityOrphanWarning />
          </EntitySwitch.Case>
        </EntitySwitch>

        <EntitySwitch>
          <EntitySwitch.Case if={hasRelationWarnings}>
            <EntityRelationWarning />
          </EntitySwitch.Case>
        </EntitySwitch>

        <EntitySwitch>
          <EntitySwitch.Case if={hasCatalogProcessingErrors}>
            <EntityProcessingErrorsPanel />
          </EntitySwitch.Case>
        </EntitySwitch>
      </div>
      {/* Root layout: flex column on mobile, CSS grid on md+ with dynamic template areas */}
      <div
        className={cn(
          'flex flex-col flex-nowrap gap-6',
          'md:grid md:gap-6 md:items-start',
        )}
        style={{
          gridTemplateAreas: hasSummaryCards
            ? '"summary info" "content info"'
            : '"content info" "content info"',
          gridTemplateColumns: hasInfoCards ? '2fr 1fr' : '1fr',
        }}
      >
        {hasInfoCards ? (
          <div
            className={cn(
              // Base: vertical flex layout with no-shrink children
              'flex flex-col flex-nowrap items-stretch gap-6 min-w-0',
              '[&>*]:shrink-0 [&>*]:grow-0',
              // md+: sticky sidebar with hidden scrollbar for info cards
              'md:[grid-area:info] md:sticky md:top-6',
              'md:max-h-screen md:overflow-y-auto md:self-start md:items-stretch',
              'md:[scrollbar-width:none] md:[-ms-overflow-style:none]',
              'md:[&::-webkit-scrollbar]:hidden',
            )}
          >
            {infoCards.map((card, index) => (
              <Fragment key={card.element.key ?? index}>
                {card.element}
              </Fragment>
            ))}
          </div>
        ) : null}
        {/* Main content wrapper: flex on mobile, display:contents on md+ to
            allow children to participate directly in the parent grid */}
        <div
          className={cn(
            'flex flex-col gap-6 items-stretch min-w-0',
            'md:contents',
          )}
        >
          {hasSummaryCards ? (
            <div className={cn('min-w-0 m-2', 'md:[grid-area:summary] md:m-2')}>
              <HorizontalScrollGrid scrollStep={400} scrollSpeed={100}>
                {summaryCards.map((card, index) => (
                  <div
                    key={card.element.key ?? index}
                    className={cn('flex-none w-full [&+&]:ml-6', 'md:w-auto')}
                  >
                    {card.element}
                  </div>
                ))}
              </HorizontalScrollGrid>
            </div>
          ) : null}
          {contentCards.length > 0 ? (
            <div
              className={cn(
                'flex flex-col gap-6 items-stretch min-w-0',
                'md:[grid-area:content]',
              )}
            >
              {contentCards.map((card, index) => (
                <Fragment key={card.element.key ?? index}>
                  {card.element}
                </Fragment>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
