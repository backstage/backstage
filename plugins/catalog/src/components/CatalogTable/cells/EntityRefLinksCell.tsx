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

import {
  CompoundEntityRef,
  Entity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Fragment } from 'react';
import { Cell, CellText, Link, Flex } from '@backstage/ui';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  entityRouteParams,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { useEntityDisplayNameContent } from './EntityDisplayNameCell';

/**
 * Props for EntityRefLinksCell
 * @internal
 */
export interface EntityRefLinksCellProps {
  id?: string;
  hidden?: boolean;
  entityRefs: (string | CompoundEntityRef | Entity)[];
  defaultKind?: string;
  hideIcons?: boolean;
}

/**
 * Helper component to render a single entity link
 * This allows us to use hooks at the component level
 * @internal
 */
function EntityRefLinkItem({
  entityRef,
  defaultKind,
  hideIcon,
  showComma,
}: {
  entityRef: string | CompoundEntityRef | Entity;
  defaultKind?: string;
  hideIcon?: boolean;
  showComma: boolean;
}) {
  const entityRoute = useRouteRef(entityRouteRef);
  const routeParams = entityRouteParams(entityRef, { encodeParams: true });
  const href = entityRoute(routeParams);
  const { primaryTitle, icon } = useEntityDisplayNameContent({
    entityRef,
    defaultKind,
    hideIcon,
  });

  const entityRefKey =
    typeof entityRef === 'string' ? entityRef : stringifyEntityRef(entityRef);

  return (
    <Fragment key={entityRefKey}>
      {showComma && ', '}
      <Link href={href} variant="body-medium" color="primary">
        {icon && (
          <Flex
            align="center"
            style={{
              marginRight: 'var(--bui-space-1)',
              color: 'var(--bui-fg-secondary)',
              display: 'inline-flex',
              verticalAlign: 'middle',
            }}
          >
            {icon}
          </Flex>
        )}
        {primaryTitle}
      </Link>
    </Fragment>
  );
}

/**
 * Cell component that displays multiple entity links separated by commas
 * Uses Cell structure but renders custom content for multiple links
 * @internal
 */
export function EntityRefLinksCell(props: EntityRefLinksCellProps) {
  const { id, hidden, entityRefs, defaultKind, hideIcons } = props;

  if (!entityRefs || entityRefs.length === 0) {
    return <CellText id={id} title="" hidden={hidden} />;
  }

  if (hidden) {
    return null;
  }

  // Render multiple links using Cell's internal structure
  return (
    <Cell id={id} className="bui-TableCell">
      <div className="bui-TableCellContentWrapper">
        <div className="bui-TableCellContent">
          {entityRefs.map((entityRef, index) => (
            <EntityRefLinkItem
              key={
                typeof entityRef === 'string'
                  ? entityRef
                  : stringifyEntityRef(entityRef)
              }
              entityRef={entityRef}
              defaultKind={defaultKind}
              hideIcon={hideIcons}
              showComma={index > 0}
            />
          ))}
        </div>
      </div>
    </Cell>
  );
}
