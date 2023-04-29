/*
 * Copyright 2020 The Backstage Authors
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

/**
 * Severity of the error, where 10 is critical and 0 is very low.
 *
 * @public
 */
export type ErrorSeverity = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * A list of errors keyed by Cluster name
 *
 * @public
 */
export type DetectedErrorsByCluster = Map<string, DetectedError[]>;

export interface ResourceRef {
  name: string;
  namespace: string;
  kind: string;
  apiGroup: string;
}

/**
 * Represents an error found on a Kubernetes object
 *
 * @public
 */
export interface DetectedError {
  type: string;
  severity: ErrorSeverity;
  message: string;
  proposedFix?: ProposedFix;
  sourceRef: ResourceRef;
  occuranceCount: number;
}

export type ProposedFix = LogSolution | DocsSolution | EventsSolution;

interface ProposedFixBase {
  errorType: string;
  rootCauseExplanation: string;
  possibleFixes: string[];
}

export interface LogSolution extends ProposedFixBase {
  type: 'logs';
  container: string;
}

export interface DocsSolution extends ProposedFixBase {
  type: 'docs';
  docsLink: string;
}

export interface EventsSolution extends ProposedFixBase {
  type: 'events';
  docsLink: string;
  podName: string;
}

export interface ErrorMapper<T> {
  detectErrors: (resource: T) => DetectedError[];
}
