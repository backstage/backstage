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

/**
 * Status of a single onboarding task.
 * @public
 */
export type TaskStatus = 'pending' | 'in-progress' | 'done' | 'blocked';

/**
 * Whether a task is completed manually or triggered via a Scaffolder template.
 * @public
 */
export type TaskType = 'manual' | 'automated';

/**
 * Onboarding phase identifier.
 * @public
 */
export type Phase = 'day1' | 'week1' | 'week2' | 'month1';

/**
 * Type of a learning or reference resource attached to a task.
 * @public
 */
export type ResourceType =
  | 'video'
  | 'doc'
  | 'article'
  | 'course'
  | 'repo'
  | 'tool';

/**
 * A reference resource attached to an onboarding task.
 * @public
 */
export interface TaskResource {
  /** Resource category. */
  type: ResourceType;
  /** Display label for the resource. */
  title: string;
  /** URL to the resource. */
  url: string;
  /** Optional human-readable duration (e.g. "20 min"). */
  duration?: string;
}

/**
 * A single item within an onboarding template phase.
 * @public
 */
export interface OnboardingTask {
  /** Unique task identifier within the template. */
  id: string;
  /** Phase this task belongs to. */
  phase: Phase;
  /** Short display title. */
  title: string;
  /** Longer description shown in the detail panel. */
  description: string;
  /** Whether the task is completed manually or via automation. */
  type: TaskType;
  /** Who is responsible for completing the task. */
  assignee: 'self' | 'buddy' | 'manager' | string;
  /** IDs of tasks that must be done first. */
  dependsOn?: string[];
  /** Scaffolder template ref for automated tasks. */
  automationRef?: string;
  /** Optional external link shown alongside the task. */
  link?: { label: string; url: string };
  /** Phase by which this task should be completed. */
  duePhase: Phase;
  /** Estimated time in minutes. */
  estimatedMinutes?: number;
  /** Long-form documentation rendered in the detail panel. */
  documentation?: string;
  /** Supplementary learning resources. */
  resources?: TaskResource[];
  /** Helpful tips or recommendations. */
  recommendations?: string[];
}

/**
 * A catalog OnboardingTemplate entity describing a role-based checklist.
 * @public
 */
export interface OnboardingTemplate {
  /** Catalog API version for onboarding templates. */
  apiVersion: 'onboarding.backstage.io/v1';
  /** Entity kind. */
  kind: 'OnboardingTemplate';
  /** Standard Backstage entity metadata. */
  metadata: {
    name: string;
    title: string;
    description?: string;
  };
  /** Template specification containing phases and tasks. */
  spec: {
    role: string;
    team?: string;
    phases: {
      id: Phase;
      tasks: OnboardingTask[];
    }[];
  };
}

/**
 * Persisted onboarding progress record for a user.
 * @public
 */
export interface OnboardingProgress {
  /** Backstage user entity ref (e.g. "user:default/jane"). */
  userId: string;
  /** Name of the assigned OnboardingTemplate. */
  templateName: string;
  /** ISO-8601 timestamp when onboarding started. */
  startDate: string;
  /** Per-task status rows. */
  tasks: {
    taskId: string;
    status: TaskStatus;
    completedAt?: string;
    blockedReason?: string;
  }[];
}

/**
 * Aggregated onboarding statistics for a team.
 * @public
 */
export interface TeamOnboardingStats {
  /** Team name. */
  teamName: string;
  /** Active joiners with their progress details. */
  activeJoiners: {
    userId: string;
    displayName: string;
    role: string;
    startDate: string;
    completionPercent: number;
    blockedTaskCount: number;
  }[];
  /** Average completion percentage across all active joiners. */
  avgCompletionPercent: number;
  /** Total number of blocked tasks across the team. */
  totalBlockedTasks: number;
}
