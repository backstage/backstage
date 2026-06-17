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

import { getPersistentVolumeType } from './persistentVolumes';

describe('getPersistentVolumeType', () => {
  it('should return null for undefined driver', () => {
    expect(getPersistentVolumeType(undefined)).toBeNull();
  });

  it('should return null for empty driver', () => {
    expect(getPersistentVolumeType('')).toBeNull();
  });

  describe('AWS drivers', () => {
    it('should return AWS EBS Volume for aws ebs driver', () => {
      expect(getPersistentVolumeType('ebs.csi.aws.com')).toBe('AWS EBS Volume');
    });

    it('should return AWS EFS for aws efs driver', () => {
      expect(getPersistentVolumeType('efs.csi.aws.com')).toBe('AWS EFS');
    });

    it('should return S3 Bucket for aws s3 driver', () => {
      expect(getPersistentVolumeType('s3.csi.aws.com')).toBe('S3 Bucket');
    });
  });

  describe('GCP drivers', () => {
    it('should return GCP Persistent Disk for gcp pd driver', () => {
      expect(getPersistentVolumeType('pd.csi.storage.gke.io')).toBe(
        'GCP Persistent Disk',
      );
    });

    it('should return GCP Filestore for gcp filestore driver', () => {
      expect(getPersistentVolumeType('filestore.csi.storage.gke.io')).toBe(
        'GCP Filestore',
      );
    });

    it('should return GCS Fuse for gcp gcsfuse driver', () => {
      expect(getPersistentVolumeType('gcsfuse.csi.storage.gke.io')).toBe(
        'GCS Fuse',
      );
    });
  });

  describe('Azure drivers', () => {
    it('should return Azure Disk for azure disk driver', () => {
      expect(getPersistentVolumeType('disk.csi.azure.com')).toBe('Azure Disk');
    });

    it('should return Azure File for azure file driver', () => {
      expect(getPersistentVolumeType('file.csi.azure.com')).toBe('Azure File');
    });

    it('should return Azure Blob for azure blob driver', () => {
      expect(getPersistentVolumeType('blob.csi.azure.com')).toBe('Azure Blob');
    });
  });

  it('should return the original driver for unknown drivers', () => {
    expect(getPersistentVolumeType('unknown.driver.com')).toBe(
      'unknown.driver.com',
    );
    expect(getPersistentVolumeType('local-storage')).toBe('local-storage');
    expect(getPersistentVolumeType('nfs')).toBe('nfs');
  });
});
