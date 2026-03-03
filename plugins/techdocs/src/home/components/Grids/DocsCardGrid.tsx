/*
 * Copyright 2021 The Backstage Authors
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

import { rootDocsRouteRef } from '../../../routes';
import { toLowerMaybe } from '../../../helpers';
import { Entity } from '@backstage/catalog-model';
import { useApi, useRouteRef, configApiRef } from '@backstage/core-plugin-api';
import {
  LinkButton,
  ItemCardGrid,
  ItemCardHeader,
} from '@backstage/core-components';

/**
 * Props for {@link DocsCardGrid}
 *
 * @public
 */
export type DocsCardGridProps = {
  entities: Entity[] | undefined;
};

/**
 * Component which accepts a list of entities and renders a item card for each entity
 *
 * @public
 */
export const DocsCardGrid = (props: DocsCardGridProps) => {
  const { entities } = props;
  const getRouteToReaderPageFor = useRouteRef(rootDocsRouteRef);
  const config = useApi(configApiRef);
  if (!entities) return null;
  return (
    <ItemCardGrid data-testid="docs-explore">
      {!entities?.length
        ? null
        : entities.map((entity, index: number) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card text-card-foreground shadow flex flex-col"
            >
              <div>
                <ItemCardHeader
                  title={entity.metadata.title ?? entity.metadata.name}
                />
              </div>
              <div className="p-4 flex-1">
                {entity.metadata.description}
              </div>
              <div className="flex items-center p-2">
                <LinkButton
                  to={getRouteToReaderPageFor({
                    namespace: toLowerMaybe(
                      entity.metadata.namespace ?? 'default',
                      config,
                    ),
                    kind: toLowerMaybe(entity.kind, config),
                    name: toLowerMaybe(entity.metadata.name, config),
                  })}
                  color="primary"
                  data-testid="read_docs"
                >
                  Read Docs
                </LinkButton>
              </div>
            </div>
          ))}
    </ItemCardGrid>
  );
};
