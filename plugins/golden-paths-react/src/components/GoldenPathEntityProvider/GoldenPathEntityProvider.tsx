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
import { PropsWithChildren, ReactNode } from 'react';
import {
  Content,
  ErrorPanel,
  Link,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import {
  EntityProvider,
  useAsyncEntity,
} from '@backstage/plugin-catalog-react';
import { GoldenPathEntityV1beta1 } from '@backstage/plugin-golden-paths-common';

type Props = PropsWithChildren & {
  GoldenPathNotFound?: ReactNode;
};

/** @public */
export const GoldenPathEntityProvider = ({
  GoldenPathNotFound,
  children,
}: Props) => {
  const { loading, error, entity } = useAsyncEntity<GoldenPathEntityV1beta1>();

  if (loading) return <Progress />;

  if (error) return <ErrorPanel error={error} />;

  if (!entity)
    return (
      GoldenPathNotFound || (
        <Content>
          <WarningPanel title="No Entity found.">
            There is no Golden Path with the requested{' '}
            <Link to="https://backstage.io/docs/features/software-catalog/references">
              kind, namespace, and name
            </Link>
            .
          </WarningPanel>
        </Content>
      )
    );

  return <EntityProvider entity={entity}>{children}</EntityProvider>;
};
