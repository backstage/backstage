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

import { createTranslationRef } from '@backstage/core-plugin-api/alpha';

/** @alpha */
export const kubernetesReactTranslationRef = createTranslationRef({
  id: 'kubernetes-react',
  messages: {
    cluster: {
      label: 'Cluster',
      pods: 'pods',
      pods_one: '{{count}} pod',
      pods_other: '{{count}} pods',
      podsWithErrors: 'pods with errors',
      podsWithErrors_one: '{{count}} pod with errors',
      podsWithErrors_other: '{{count}} pods with errors',
      noPodsWithErrors: 'No pods with errors',
    },
    podsTable: {
      columns: {
        id: 'ID',
        name: 'name',
        phase: 'phase',
        status: 'status',
        containersReady: 'containers ready',
        totalRestarts: 'total restarts',
        cpuUsage: 'CPU usage %',
        memoryUsage: 'Memory usage %',
      },
      unknown: 'unknown',
      status: {
        running: 'Running',
        ok: 'OK',
      },
    },
    errorPanel: {
      title: 'There was a problem retrieving Kubernetes objects',
      message:
        'There was a problem retrieving some Kubernetes resources for the entity: {{entityName}}. This could mean that the Error Reporting card is not completely accurate.',
      errorsLabel: 'Errors',
      clusterLabel: 'Cluster',
      clusterLabelValue: 'Cluster: {{cluster}}',
      fetchError:
        'Error communicating with Kubernetes: {{errorType}}, message: {{message}}',
      resourceError:
        "Error fetching Kubernetes resource: '{{resourcePath}}', error: {{errorType}}, status code: {{statusCode}}",
    },
    fixDialog: {
      helpButton: 'Help',
      title: '{{podName}} - {{errorType}}',
      detectedError: 'Detected error:',
      causeExplanation: 'Cause explanation:',
      fix: 'Fix:',
      crashLogs: 'Crash logs:',
      events: 'Events:',
      openDocs: 'Open docs',
      ariaLabels: {
        fixIssue: 'fix issue',
        close: 'close',
      },
    },
    podDrawer: {
      buttons: {
        delete: 'Delete Pod',
      },
      cpuRequests: 'CPU requests',
      cpuLimits: 'CPU limits',
      memoryRequests: 'Memory requests',
      memoryLimits: 'Memory limits',
      resourceUtilization: 'Resource utilization',
    },
    hpa: {
      minReplicas: 'min replicas',
      maxReplicas: 'max replicas',
      replicasSummary: 'min replicas {{min}} / max replicas {{max}}',
      currentCpuUsage: 'current CPU usage:',
      currentCpuUsageLabel: 'current CPU usage: {{value}}%',
      targetCpuUsage: 'target CPU usage:',
      targetCpuUsageLabel: 'target CPU usage: {{value}}%',
    },
    pods: {
      pods_one: '{{count}} pod',
      pods_other: '{{count}} pods',
    },
    errorReporting: {
      title: 'Error Reporting',
      columns: {
        cluster: 'cluster',
        namespace: 'namespace',
        kind: 'kind',
        name: 'name',
        messages: 'messages',
      },
    },
    podLogs: {
      title: 'No logs emitted',
      description: 'No logs were emitted by the container',
      buttonText: 'Logs',
      buttonAriaLabel: 'get logs',
      titleTemplate:
        '{{podName}} - {{containerName}} logs on cluster {{clusterName}}',
    },
    podExecTerminal: {
      buttonText: 'Terminal',
      buttonAriaLabel: 'open terminal',
      titleTemplate:
        '{{podName}} - {{containerName}} terminal shell on cluster {{clusterName}}',
    },
    events: {
      noEventsFound: 'No events found',
      eventTooltip: '{{eventType}} event',
      firstEvent: 'First event {{timeAgo}} (count: {{count}})',
    },
    kubernetesDrawer: {
      closeDrawer: 'Close the drawer',
      yaml: 'YAML',
      managedFields: 'Managed Fields',
      unknownName: 'unknown name',
    },
    linkErrorPanel: {
      title:
        'There was a problem formatting the link to the Kubernetes dashboard',
      message:
        "Could not format the link to the dashboard of your cluster named '{{clusterName}}'. Its dashboardApp property has been set to '{{dashboardApp}}.'",
      errorsLabel: 'Errors:',
    },
    namespace: {
      label: 'namespace:',
      labelWithValue: 'namespace: {{namespace}}',
    },
    kubernetesDialog: {
      closeAriaLabel: 'close',
    },
  },
});
