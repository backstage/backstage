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
import {
  AndroidRelease,
  AndroidReleaseNote,
  AndroidReleaseStatus,
  Maybe,
  Status,
} from '../types';

const statusMap: { [key: string]: number } = {
  loading: 0,
  'no-data': 1,
  ok: 2,
  warning: 3,
  error: 4,
};

const androidStatusMap: { [key: string]: Status } = {
  completed: 'ok',
  draft: 'no-data',
  halted: 'error',
  inProgress: 'warning',
};

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
  if (statusMap[newStatus] > statusMap[status]) setStatus(newStatus);
};

export const getAndroidReleaseStatus = (
  androidReleaseStatus: AndroidReleaseStatus,
): Maybe<Status> => {
  return androidStatusMap[androidReleaseStatus];
};

export const getAndroidReleaseNotesStatus = (
  androidReleaseNotes: AndroidReleaseNote[],
): Maybe<Status> => {
  if (!androidReleaseNotes) return 'error';
  if (androidReleaseNotes && androidReleaseNotes.length > 0) return 'ok';

  return null;
};

export const findStatuses = ({
  setStatus,
  status,
  androidRelease,
}: {
  setStatus: Function;
  status: Status;
  androidRelease: AndroidRelease;
}) => {
  handleStatus({
    setStatus,
    status,
    newStatus: getAndroidReleaseStatus(androidRelease.status),
  });
  handleStatus({
    setStatus,
    status,
    newStatus: getAndroidReleaseNotesStatus(androidRelease.releaseNotes),
  });
};
