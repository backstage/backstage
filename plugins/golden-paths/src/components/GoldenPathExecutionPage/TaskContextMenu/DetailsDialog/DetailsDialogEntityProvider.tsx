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
import { PropsWithChildren } from 'react';
import { Entity } from '@backstage/catalog-model';
import { ErrorPanel, Progress } from '@backstage/core-components';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { AsyncState } from 'react-use/esm/useAsyncFn';

type Props = {
  asyncEntityState: AsyncState<Entity | undefined>;
};

export const DetailsDialogEntityProvider = ({
  asyncEntityState: { loading, error, value },
  children,
}: PropsWithChildren<Props>) => {
  if (loading) return <Progress />;

  if (error || !value)
    return <ErrorPanel error={new Error('No Golden Path Entity found')} />;

  return <EntityProvider entity={value}>{children}</EntityProvider>;
};
