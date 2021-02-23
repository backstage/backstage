/*
 * Copyright 2021 Spotify AB
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
import React, { useEffect } from 'react';
import { useApi, errorApiRef, Progress } from '@backstage/core';
import Alert from '@material-ui/lab/Alert';
import { useEntity } from '../../hooks';

export interface EntitySuspenseProps {
  fallback?: React.ComponentType;
  children: React.ReactNode;
}

export const EntitySuspense = ({
  fallback: Fallback = Progress,
  children,
}: EntitySuspenseProps) => {
  const { loading, error } = useEntity();
  const errorApi = useApi(errorApiRef);

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error, errorApi]);

  if (loading) {
    return <Fallback />;
  } else if (error) {
    return <Alert severity="error">{error?.message}</Alert>;
  }
  return <>{children}</>;
};

export function withEntitySuspense<P>(
  Component: React.ComponentType<P>,
  options?: Omit<EntitySuspenseProps, 'children'>,
) {
  return (props: P) => (
    <EntitySuspense {...options}>
      <Component {...props} />
    </EntitySuspense>
  );
}
