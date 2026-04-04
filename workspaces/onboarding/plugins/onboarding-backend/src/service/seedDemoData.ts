/*
 * Copyright 2026 Estehsan Tariq
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

import { LoggerService } from '@backstage/backend-plugin-api';
import { DatabaseOnboardingStore } from './OnboardingStore';
import { OnboardingProgress } from '../types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const demoProgressRecords: OnboardingProgress[] = [
  // Guest user — the default local dev user, 4 of 10 done
  {
    userId: 'user:default/guest',
    templateName: 'backend-engineer-platform',
    startDate: daysAgo(7),
    tasks: [
      { taskId: 'setup-laptop', status: 'done', completedAt: daysAgo(7) },
      { taskId: 'meet-buddy', status: 'done', completedAt: daysAgo(7) },
      { taskId: 'slack-channels', status: 'done', completedAt: daysAgo(6) },
      { taskId: 'security-training', status: 'done', completedAt: daysAgo(5) },
      { taskId: 'repo-tour', status: 'in-progress' },
      { taskId: 'oncall-shadow', status: 'pending' },
      { taskId: 'first-pr', status: 'pending' },
      { taskId: 'architecture-review', status: 'pending' },
      { taskId: '30-day-checkin', status: 'pending' },
      {
        taskId: 'production-access',
        status: 'blocked',
        blockedReason: 'Waiting for on-call shadow to complete first',
      },
    ],
  },
  // Jane — 12 days in, 5 of 10 tasks done, 1 blocked
  {
    userId: 'user:default/jane.doe',
    templateName: 'backend-engineer-platform',
    startDate: daysAgo(12),
    tasks: [
      { taskId: 'setup-laptop', status: 'done', completedAt: daysAgo(12) },
      { taskId: 'meet-buddy', status: 'done', completedAt: daysAgo(12) },
      { taskId: 'slack-channels', status: 'done', completedAt: daysAgo(11) },
      { taskId: 'security-training', status: 'done', completedAt: daysAgo(9) },
      { taskId: 'repo-tour', status: 'done', completedAt: daysAgo(8) },
      { taskId: 'oncall-shadow', status: 'in-progress' },
      { taskId: 'first-pr', status: 'pending' },
      { taskId: 'architecture-review', status: 'pending' },
      { taskId: '30-day-checkin', status: 'pending' },
      {
        taskId: 'production-access',
        status: 'blocked',
        blockedReason: 'Waiting for on-call shadow to complete first',
      },
    ],
  },
  // Alex — 5 days in, 3 of 7 tasks done
  {
    userId: 'user:default/alex.chen',
    templateName: 'frontend-engineer-design-systems',
    startDate: daysAgo(5),
    tasks: [
      { taskId: 'fe-setup-laptop', status: 'done', completedAt: daysAgo(5) },
      { taskId: 'fe-meet-buddy', status: 'done', completedAt: daysAgo(5) },
      { taskId: 'fe-figma-access', status: 'done', completedAt: daysAgo(4) },
      { taskId: 'fe-a11y-training', status: 'in-progress' },
      { taskId: 'fe-component-tour', status: 'pending' },
      { taskId: 'fe-first-component', status: 'pending' },
      { taskId: 'fe-30-day-checkin', status: 'pending' },
    ],
  },
  // Sam — 20 days in, 6 of 8 done, 1 blocked
  {
    userId: 'user:default/sam.wilson',
    templateName: 'sre-infrastructure',
    startDate: daysAgo(20),
    tasks: [
      { taskId: 'sre-setup', status: 'done', completedAt: daysAgo(20) },
      { taskId: 'sre-meet-buddy', status: 'done', completedAt: daysAgo(20) },
      { taskId: 'sre-incident-training', status: 'done', completedAt: daysAgo(17) },
      { taskId: 'sre-monitoring-tour', status: 'done', completedAt: daysAgo(15) },
      { taskId: 'sre-oncall-shadow', status: 'done', completedAt: daysAgo(10) },
      { taskId: 'sre-runbook-update', status: 'done', completedAt: daysAgo(6) },
      {
        taskId: 'sre-primary-oncall',
        status: 'blocked',
        blockedReason: 'Schedule conflict — rescheduled to next rotation',
      },
      { taskId: 'sre-30-day-checkin', status: 'pending' },
    ],
  },
  // Taylor — 2 days in, 2 of 10 tasks done (just started)
  {
    userId: 'user:default/taylor.kim',
    templateName: 'backend-engineer-platform',
    startDate: daysAgo(2),
    tasks: [
      { taskId: 'setup-laptop', status: 'done', completedAt: daysAgo(2) },
      { taskId: 'meet-buddy', status: 'done', completedAt: daysAgo(2) },
      { taskId: 'slack-channels', status: 'in-progress' },
      { taskId: 'security-training', status: 'pending' },
      { taskId: 'repo-tour', status: 'pending' },
      { taskId: 'oncall-shadow', status: 'pending' },
      { taskId: 'first-pr', status: 'pending' },
      { taskId: 'architecture-review', status: 'pending' },
      { taskId: '30-day-checkin', status: 'pending' },
      { taskId: 'production-access', status: 'pending' },
    ],
  },
];

/** Seeds the database with demo progress data for development. */
export async function seedDemoData(options: {
  store: DatabaseOnboardingStore;
  logger: LoggerService;
}): Promise<void> {
  const { store, logger } = options;

  for (const record of demoProgressRecords) {
    const existing = await store.getProgress(record.userId);
    if (!existing) {
      await store.upsertProgress(record);
      logger.info(
        `Seeded demo onboarding progress for ${record.userId} (template: ${record.templateName})`,
      );
    }
  }
}
