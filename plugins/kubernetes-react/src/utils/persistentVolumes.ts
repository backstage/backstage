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

export const getPersistentVolumeType = (driver?: string): string | null => {
  if (!driver) return null;

  if (driver.includes('aws')) {
    if (driver.includes('ebs')) return `AWS EBS Volume`;
    if (driver.includes('efs')) return `AWS EFS`;
    if (driver.includes('s3')) return `S3 Bucket`;
  }

  if (driver.includes('gke')) {
    if (driver.includes('gcsfuse')) return `GCS Fuse`;
    if (driver.includes('filestore')) return `GCP Filestore`;
    if (driver.includes('pd')) return `GCP Persistent Disk`;
  }

  if (driver.includes('azure')) {
    if (driver.includes('disk')) return `Azure Disk`;
    if (driver.includes('file')) return `Azure File`;
    if (driver.includes('blob')) return `Azure Blob`;
  }

  return driver;
};
