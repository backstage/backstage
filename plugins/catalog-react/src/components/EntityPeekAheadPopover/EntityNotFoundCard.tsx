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
import { Card, CardContent } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';

/**
 * Entity not found card
 *
 * @private
 */
export const EntityNotFoundCard = ({
  entityRef,
  error,
}: {
  entityRef: string;
  error?: Error;
}) => {
  return (
    <Card>
      <CardContent>
        <Alert severity="warning">
          {entityRef} was not found {error?.message}
        </Alert>
      </CardContent>
    </Card>
  );
};
