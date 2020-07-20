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
export type AndroidReleaseNote = {
  language: string;
  text: string;
};

export type AndroidVersionCode = string;
export type AndroidReleaseStatus =
  | 'completed'
  | 'draft'
  | 'halted'
  | 'inProgress';

export type AndroidRelease = {
  name: string;
  releaseNotes: AndroidReleaseNote[];
  status: AndroidReleaseStatus;
  versionCodes: AndroidVersionCode[];
};

export type AndroidTrack = {
  releases: AndroidRelease[];
  track: string;
};

export type Status = 'loading' | 'ok' | 'warning' | 'error' | 'no-data';
export type Maybe<T> = T | null;

export type Release = {
  platform: string;
  version: string;
};
