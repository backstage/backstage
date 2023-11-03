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
import { Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { ShouldIDeployCIApiRef } from '../../api';
import { getBackegroundColor } from '../../helpers/getBackgroundColor';
import { cardStyles } from './CardStyles';
import { Typography } from '@material-ui/core';

export const ShouldIDeployCard = ({ timeZone }: { timeZone?: string }) => {
  const [reason, setReasons] = React.useState<string>();
  const [backgroundColor, setBackgroundColor] = React.useState<string>();
  const classes = cardStyles();

  const ShouldIDeployCIApi = useApi(ShouldIDeployCIApiRef);
  const { loading, error } = useAsync(async () => {
    const res = await ShouldIDeployCIApi.get(timeZone);
    const day = new Date(res.date).getDay();
    setBackgroundColor(getBackegroundColor(day));
    setReasons(res?.message);

    return res;
  }, []);

  const onClick = async (event: { type: string }) => {
    if (event.type === 'click') {
      const response = await ShouldIDeployCIApi.get(timeZone);
      setReasons(response.message);
    }
  };

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return (
    <div
      className={classes.container}
      data-testid="should-i-deploy-card"
      style={{ backgroundColor }}
    >
      <div className={classes.card}>
        <h3 className={classes.tagline}>Should I Deploy Today?</h3>
        <h2 id="text" className={classes.reason}>
          {reason}
        </h2>
        <Typography
          variant="body1"
          className={`${classes.reload}`}
          onClick={onClick}
        >
          Click
        </Typography>
      </div>
    </div>
  );
};
