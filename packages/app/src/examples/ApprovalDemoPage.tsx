/*
 * Copyright 2026 The Backstage Authors
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

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { ResponseError, stringifyError } from '@backstage/errors';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import type { ScaffolderTask } from '@backstage/plugin-scaffolder-common';
import {
  Alert,
  Button,
  Card,
  CardBody,
  Flex,
  Link,
  Text,
  TextField,
} from '@backstage/ui';

const guestRef = 'user:development/guest';
const terminalStatuses = new Set(['completed', 'failed', 'cancelled']);

export function ApprovalDemoPage() {
  const scaffolder = useApi(scaffolderApiRef);
  const discovery = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef);
  const identity = useApi(identityApiRef);
  const [searchParams, setSearchParams] = useSearchParams();
  const taskId = searchParams.get('taskId');
  const [message, setMessage] = useState('Try the approval gate');
  const [approver, setApprover] = useState(guestRef);
  const [userRef, setUserRef] = useState<string>();
  const [ownershipRefs, setOwnershipRefs] = useState<string[]>([]);
  const [task, setTask] = useState<ScaffolderTask>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let cancelled = false;
    identity.getBackstageIdentity().then(
      user => {
        if (!cancelled) {
          setUserRef(user.userEntityRef);
          setOwnershipRefs([user.userEntityRef, ...user.ownershipEntityRefs]);
        }
      },
      cause => {
        if (!cancelled) setError(stringifyError(cause));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [identity]);

  useEffect(() => {
    setTask(undefined);
    setError(undefined);
    if (!taskId) return undefined;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function refresh() {
      let finished = false;
      try {
        const current = await scaffolder.getTask(taskId!);
        if (cancelled) return;
        setTask(current);
        finished = terminalStatuses.has(current.status);
      } catch (cause) {
        if (!cancelled) setError(stringifyError(cause));
      }
      if (!cancelled && !finished) timer = setTimeout(refresh, 1000);
    }
    void refresh();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [scaffolder, taskId]);

  async function start() {
    setBusy(true);
    setError(undefined);
    try {
      const created = await scaffolder.scaffold({
        templateRef: 'template:default/approval-gate-demo',
        values: { message, approver },
      });
      setSearchParams({ taskId: created.taskId });
    } catch (cause) {
      setError(stringifyError(cause));
    } finally {
      setBusy(false);
    }
  }

  async function approve() {
    if (!taskId) return;
    setBusy(true);
    setError(undefined);
    try {
      const baseUrl = await discovery.getBaseUrl('scaffolder');
      const response = await fetchApi.fetch(
        `${baseUrl}/v2/tasks/${encodeURIComponent(taskId)}/resume`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: 'approval',
            triggerId: 'decision',
            payload: { decision: 'approved' },
          }),
        },
      );
      if (!response.ok) throw await ResponseError.fromResponse(response);
      setTask(await scaffolder.getTask(taskId));
    } catch (cause) {
      setError(stringifyError(cause));
    } finally {
      setBusy(false);
    }
  }

  const selectedApprover =
    typeof task?.spec.parameters.approver === 'string'
      ? task.spec.parameters.approver
      : guestRef;
  const canApprove = ownershipRefs.includes(selectedApprover);

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <Flex direction="column" gap="4">
        <Text as="h2" variant="title-large">
          Try the approval gate
        </Text>
        <Text as="p">
          Start a task, open its notification, and approve it. The task releases
          its worker while it waits.
        </Text>
        <Text as="p">Signed in as {userRef ?? 'loading identity'}</Text>
        {error && (
          <Alert
            status="danger"
            title="The request failed"
            description={error}
          />
        )}
        {!taskId ? (
          <Card>
            <CardBody>
              <form
                onSubmit={event => {
                  event.preventDefault();
                  void start();
                }}
              >
                <Flex direction="column" gap="4">
                  <TextField
                    label="Request"
                    value={message}
                    onChange={setMessage}
                    isRequired
                  />
                  <TextField
                    label="Approver entity reference"
                    value={approver}
                    onChange={setApprover}
                    isRequired
                  />
                  <Button
                    type="submit"
                    isDisabled={busy || !message.trim() || !approver.trim()}
                  >
                    Start approval session
                  </Button>
                </Flex>
              </form>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody>
              <Flex direction="column" gap="4">
                <Text as="p">Task: {taskId}</Text>
                <Text as="p">
                  Request:{' '}
                  {typeof task?.spec.parameters.message === 'string'
                    ? task.spec.parameters.message
                    : 'loading'}
                </Text>
                <Text as="p">Status: {task?.status ?? 'loading'}</Text>
                <Text as="p">Approver: {selectedApprover}</Text>
                {task?.status === 'waiting' && (
                  <Alert
                    status="info"
                    title="Waiting for approval"
                    description="Open Notifications to see the approval request. Approving here resumes the task."
                  />
                )}
                {task?.status === 'completed' && (
                  <Alert
                    status="success"
                    title="Workflow continued after approval"
                    description="The task completed and sent a completion notification."
                  />
                )}
                {(task?.status === 'failed' ||
                  task?.status === 'cancelled') && (
                  <Alert
                    status="warning"
                    title={`Task ${task.status}`}
                    description="Open the task logs for details."
                  />
                )}
                {task?.status === 'waiting' && !canApprove && (
                  <Alert
                    status="warning"
                    title="Another account must approve"
                    description={`Sign in as ${selectedApprover} or a member of that group.`}
                  />
                )}
                <Flex gap="3">
                  <Button
                    onPress={() => void approve()}
                    isDisabled={
                      busy || task?.status !== 'waiting' || !canApprove
                    }
                  >
                    Approve and continue
                  </Button>
                  <Button
                    variant="secondary"
                    isDisabled={busy}
                    onPress={() => setSearchParams({})}
                  >
                    New session
                  </Button>
                </Flex>
                <Flex gap="3">
                  <Link href={`/create/tasks/${taskId}`}>Open task logs</Link>
                  <Link href="/notifications">Open notifications</Link>
                </Flex>
              </Flex>
            </CardBody>
          </Card>
        )}
      </Flex>
    </div>
  );
}
