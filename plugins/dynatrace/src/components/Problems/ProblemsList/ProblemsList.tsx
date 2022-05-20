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
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { ProblemsTable } from '../ProblemsTable';
import { Problem } from '../types';

type ProblemsListProps = {
  entityDynatraceId: string;
};

export const ProblemsList = (props: ProblemsListProps) => {
  const { entityDynatraceId } = props;
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async () => {
    const backendUrl = config.getString('backend.baseUrl');
    const problemQuerySelector = `?entitySelector=entityId(${entityDynatraceId})`;
    const response = await fetch(
      `${backendUrl}/api/proxy/dynatrace/problems${problemQuerySelector}`,
    );
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data.problems;
  }, []);
  const problems: Problem[] = value;

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return <ProblemsTable problems={problems} />;
};
