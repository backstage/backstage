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
import React from 'react';
import { useEntityEnvironment } from '@backstage/plugin-catalog-react';
import { Select } from '@backstage/core-components';
import { Box, CircularProgress } from '@material-ui/core';
import { stringifyEntityRef } from '@backstage/catalog-model';

export const EntityEnvironmentPicker = () => {
  const { environments, environment, setEnvironment, loading } =
    useEntityEnvironment();

  if (loading) return <CircularProgress />;

  return (
    <Box pb={1} pt={1}>
      <Select
        label="Environments"
        items={
          environments?.map(e => ({
            label: e.metadata.name,
            value: stringifyEntityRef(e),
          })) || []
        }
        selected={environment ? stringifyEntityRef(environment) : ''}
        onChange={value =>
          setEnvironment(
            environments?.find(e => stringifyEntityRef(e) === value),
          )
        }
      />
    </Box>
  );
};
