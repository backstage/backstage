/*
 * Copyright 2020 Spotify AB
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
import { LatestBuild, Maybe, Status } from '../types';
import { AxiosError } from 'axios';

const handleStatus = ({
  setStatus,
  newStatus,
  status,
}: {
  setStatus: Function;
  newStatus: Maybe<Status>;
  status: Status;
}) => {
  if (!newStatus) return;

  const statusMap: { [key: string]: number } = {
    loading: 0,
    'no-data': 1,
    ok: 2,
    warning: 3,
    error: 4,
  };

  if (statusMap[newStatus] > statusMap[status]) setStatus(newStatus);
};

export const latestBuildStatus = (
  build: LatestBuild,
  error?: AxiosError,
): Maybe<Status> => {
  if (error) {
    if (error.request.status === 501 || error.request.status === 404)
      return 'no-data';
    return 'error';
  }

  if (build) {
    return 'ok';
  }

  return null;
};

export const findStatuses = ({
  setStatus,
  status,
  latestAppstoreData,
  latestAppstoreError,
}: {
  setStatus: Function;
  status: Status;
  latestAppstoreData: LatestBuild;
  latestAppstoreError?: AxiosError;
}) => {
  handleStatus({
    setStatus,
    status,
    newStatus: latestBuildStatus(latestAppstoreData, latestAppstoreError),
  });
};
