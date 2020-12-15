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

interface Resource {
  namespace: string;
  type: string;
  name: string;
}
interface Stats {
  successCount: string;
  failureCount: string;
  latencyMsP50: string;
  latencyMsP95: string;
  latencyMsP99: string;
  actualSuccessCount: string;
  actualFailureCount: string;
}

interface BackstageMetrics {
  totalRequests: number;
  rps: number;
  successRate: number;
  failureRate: number;
}

export interface Metrics {
  resource: Resource;
  timeWindow: string;
  status: string;
  meshedPodCount: string;
  runningPodCount: string;
  failedPodCount: string;
  stats: Stats;
  b7e: BackstageMetrics;
}

type MetricType = Partial<'deployment' | 'service' | 'authority' | 'pod'>;

export interface DeploymentResponse {
  inbound: Record<MetricType, Metrics>;
  outbound: Record<MetricType, Metrics>;
}

export interface L5dClient {
  getForDeployment(
    namespace: string,
    deployment: string,
  ): Promise<DeploymentResponse>;
}
