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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { useAsyncEntity } from '@backstage/plugin-catalog-react';
import { ReactNode, ReactElement, useMemo, useRef } from 'react';
import {
  attachComponentData,
  useApiHolder,
  useElementFilter,
  ApiHolder,
} from '@backstage/core-plugin-api';
import useAsync from 'react-use/esm/useAsync';

const ENTITY_SWITCH_KEY = 'core.backstage.entitySwitch';

/** @public */
export interface EntitySwitchCaseProps {
  if?: (
    entity: Entity,
    context: { apis: ApiHolder },
  ) => boolean | Promise<boolean>;
  children: ReactNode;
}

const EntitySwitchCaseComponent = (_props: EntitySwitchCaseProps) => null;

attachComponentData(EntitySwitchCaseComponent, ENTITY_SWITCH_KEY, true);

interface EntitySwitchCase {
  if?: (
    entity: Entity,
    context: { apis: ApiHolder },
  ) => boolean | Promise<boolean>;
  children: JSX.Element;
}

// The outcome of evaluating each case, where `undefined` marks a default case
type CaseOutcome = boolean | Promise<boolean> | undefined;
type CaseMatch = boolean | undefined;

/**
 * Props for the {@link EntitySwitch} component.
 * @public
 */
export interface EntitySwitchProps {
  children: ReactNode;
  renderMultipleMatches?: 'first' | 'all';
}

/** @public */
export const EntitySwitch = (props: EntitySwitchProps) => {
  const { entity, loading } = useAsyncEntity();
  const apis = useApiHolder();

  const cases = useElementFilter(props.children, collection =>
    collection
      .selectByComponentData({
        key: ENTITY_SWITCH_KEY,
        withStrictError: 'Child of EntitySwitch is not an EntitySwitch.Case',
      })
      .getElements()
      .map((element: ReactElement) => element.props as EntitySwitchCase),
  );

  // The children are new elements on every parent render, so the conditions
  // are only evaluated again when their actual inputs change.
  const conditions = useShallowStableArray(cases.map(c => c.if));
  const outcomes = useMemo((): CaseOutcome[] | undefined => {
    if (loading && !entity) {
      return undefined;
    }
    return conditions.map(condition => {
      if (!entity) {
        return condition === undefined;
      }
      return condition?.(entity, { apis });
    });
  }, [conditions, entity, loading, apis]);

  if (!outcomes) {
    return <></>;
  }

  if (outcomes.some(isPromiseLike)) {
    return (
      <AsyncEntitySwitch
        // Reset any previously resolved matches when switching entity
        key={entity ? stringifyEntityRef(entity) : undefined}
        cases={cases}
        outcomes={outcomes}
        renderMultipleMatches={props.renderMultipleMatches}
      />
    );
  }

  return selectChildren(
    cases,
    outcomes as CaseMatch[],
    props.renderMultipleMatches,
  );
};

function AsyncEntitySwitch({
  cases,
  outcomes,
  renderMultipleMatches,
}: {
  cases: EntitySwitchCase[];
  outcomes: CaseOutcome[];
  renderMultipleMatches?: 'first' | 'all';
}) {
  const { value: matches } = useAsync(
    () =>
      Promise.all(
        outcomes.map(async (outcome): Promise<CaseMatch> => {
          if (outcome === undefined) {
            return undefined;
          }
          try {
            return Boolean(await outcome);
          } catch {
            return false;
          }
        }),
      ),
    [outcomes],
  );

  // While conditions are evaluated again for the same entity, keep rendering
  // the previous matches rather than unmounting the content.
  if (!matches || matches.length !== cases.length) {
    return null;
  }

  return selectChildren(cases, matches, renderMultipleMatches);
}

function selectChildren(
  cases: EntitySwitchCase[],
  matches: CaseMatch[],
  renderMultipleMatches?: 'first' | 'all',
) {
  if (renderMultipleMatches === 'all') {
    const children = cases.filter((_, i) => matches[i]).map(c => c.children);
    if (children.length > 0) {
      return <>{children}</>;
    }
  } else {
    const match = cases.find((_, i) => matches[i]);
    if (match) {
      return match.children;
    }
  }
  return cases.filter((_, i) => matches[i] === undefined)[0]?.children ?? null;
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as PromiseLike<unknown>).then === 'function'
  );
}

// Returns the previous array instance as long as its items are the same
function useShallowStableArray<T>(array: T[]): T[] {
  const ref = useRef(array);
  const prev = ref.current;
  if (
    prev.length !== array.length ||
    prev.some((item, index) => item !== array[index])
  ) {
    ref.current = array;
  }
  return ref.current;
}

EntitySwitch.Case = EntitySwitchCaseComponent;
