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
import React from 'react';
import { Typography, Grid } from '@material-ui/core';

export const NewRelicExample = () => {
  // const [dashboardUrl, setDashboardUrl] = React.useState<
  //   DashboardSnapshotSummary | undefined
  // >();

  // const NewRelicDashboardAPI = useApi(NewRelicDashboardApiRef);
  // const { value } = useAsync(async (): Promise<any> => {
  //   let dashboardObject: any = NewRelicDashboardAPI.getDashboardEntity(
  //     'MjY2NjU3MnxWSVp8REFTSEJPQVJEfGRhOjQ0OTc1MA',
  //   );

  //   return dashboardObject;
  // }, []);
  // useEffect(() => {
  //   if (value) {
  //     NewRelicDashboardAPI.getDashboardSnapshot(
  //       value?.getDashboardEntity?.data?.actor.entitySearch.results.entities[0]
  //         .guid,
  //       '2000000000',
  //     );
  //   }
  // }, [value]);

  // console.log(
  //   value?.getDashboardEntity.data.actor.entitySearch.results.entities[0].guid,
  // );

  return (
    <Grid container spacing={3} direction="column">
      <Typography variant="h4">
        New Relic Dashboards loaded via custom APIs
      </Typography>
      <Grid item>
        {/* {data.getTodos.map((todo: ITodo) => ( */}
        {/* <>{JSON.stringify(value)}</>
        <>{JSON.stringify(dashboardUrl?.getDashboardSnapshot.data.dashboardCreateSnapshotUrl)}</> */}
        {/* {value?.getDashboardSnapshot?.map(contributor => (
          <Grid item>
            <>{contributor}</>
          </Grid>
        ))} */}
        {/* <img src={String(dashboardUrl?.dashboardCreateSnapshotUrl)}></img> */}
        {/* ))} */}
      </Grid>
    </Grid>
  );
};
