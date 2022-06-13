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
import { useApi } from '@backstage/core-plugin-api';
import { ProblemsTable } from '../ProblemsTable';
import { dynatraceApiRef } from '../../../api';

type ProblemsListProps = {
  dynatraceEntityId: string;
};

export const ProblemsList = (props: ProblemsListProps) => {
  const { dynatraceEntityId } = props;
  const dynatraceApi = useApi(dynatraceApiRef);
  const { value, loading, error } = useAsync(async () => {
    return dynatraceApi.getDynatraceProblems(dynatraceEntityId);
  }, [dynatraceApi, dynatraceEntityId]);
  const problems = value?.problems;

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  if (!problems) return <div>Nothing to report :)</div>;
  return <ProblemsTable problems={problems} />;
};
