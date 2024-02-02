/*
 * Copyright 2024 The Backstage Authors
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
  ProfileInfo,
  alertApiRef,
  googleAuthApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import {
  GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION_PATTERN,
  cloudWorkstationsApiRef,
} from '../api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Workstation, WorkstationState } from '../api/types';
import { WorkstationsData } from './types';

/** @public */
export const GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION =
  'google.com/cloudworkstations-config';

export function useWorkstations() {
  const { entity } = useEntity();
  const workstationsApi = useApi(cloudWorkstationsApiRef);
  const googleApi = useApi(googleAuthApiRef);
  const alertApi = useApi(alertApiRef);

  const [googleAuthProfile, setGoogleAuthProfile] = useState<ProfileInfo>();

  const [workstationsData, setWorkstationsData] = useState<WorkstationsData>();

  const [refreshData, setRefreshData] = useState(true);

  const refreshWorkstationsData = (timeout: number = 500) => {
    setTimeout(() => {
      setRefreshData(true);
    }, timeout);
  };

  const workstationConfig: string | undefined = useMemo(() => {
    if (!entity || !workstationsApi) {
      return undefined;
    }

    const annotationValue =
      entity.metadata?.annotations?.[GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION];

    if (!annotationValue) {
      return undefined;
    }

    if (!workstationsApi.validWorkstationsConfigString(annotationValue)) {
      alertApi?.post({
        message: `Invalid workstations config entity annotation value: ${annotationValue}. Expected value pattern: ${GCP_CLOUDWORKSTATIONS_CONFIG_ANNOTATION_PATTERN}`,
        severity: 'error',
      });
      return undefined;
    }

    return annotationValue;
  }, [entity, workstationsApi, alertApi]);

  const getWorkstationConfigDetails = useCallback(
    async (config: string) => {
      return workstationsApi.getWorkstationConfigDetails(config);
    },
    [workstationsApi],
  );

  const getWorkstationsData = useCallback(
    async (config: string): Promise<[Record<string, any>, Workstation[]]> => {
      return Promise.all([
        getWorkstationConfigDetails(config),
        workstationsApi.getWorkstations(config),
      ]);
    },
    [workstationsApi, getWorkstationConfigDetails],
  );

  const createWorkstation = async (config: string) => {
    await workstationsApi.createWorkstation(config);
    refreshWorkstationsData();
  };

  const startWorkstation = async (config: string, workstation: string) => {
    await workstationsApi.startWorkstation(config, workstation);
    refreshWorkstationsData();
  };

  const stopWorkstation = async (config: string, workstationName: string) => {
    await workstationsApi.stopWorkstation(config, workstationName);
    refreshWorkstationsData();
  };

  useEffect(() => {
    if (refreshData) {
      googleApi?.getProfile()?.then(profile => {
        setGoogleAuthProfile(profile);
      });
    }
  }, [refreshData, googleApi]);

  useEffect(() => {
    if (workstationConfig && googleAuthProfile && refreshData) {
      getWorkstationsData(workstationConfig).then(
        ([configDetails, workstations]) => {
          setWorkstationsData({ configDetails, workstations });
          setRefreshData(false);
        },
      );
    }
  }, [workstationConfig, googleAuthProfile, refreshData, getWorkstationsData]);

  useEffect(() => {
    if (workstationsData?.workstations) {
      for (const workstation of workstationsData.workstations) {
        if (
          !workstation.state ||
          WorkstationState[workstation.state] ===
            WorkstationState.STATE_STARTING
        ) {
          refreshWorkstationsData(2000);
        }
      }
    }
  }, [workstationsData]);

  return {
    workstationConfig,
    workstationsData,
    getWorkstationsData,
    createWorkstation,
    startWorkstation,
    stopWorkstation,
    refreshWorkstationsData,
  };
}
