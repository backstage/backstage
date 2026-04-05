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

/**
 * Severity level for an operational zone.
 *
 * @public
 */
export type ZoneLevel = 'green' | 'yellow' | 'red';

/**
 * A resolved operational zone representing the current state of an operation.
 *
 * @public
 */
export interface Zone {
  /** Unique operation identifier, e.g. "backstage-upgrades" */
  id: string;
  /** Current zone level */
  level: ZoneLevel;
  /** Human-readable label, e.g. "Safe for upgrades" */
  label: string;
  /** When the current window expires; undefined if no window is active */
  activeUntil?: Date;
}

/**
 * A time-based schedule defining when zone levels change for a given operation.
 *
 * @public
 */
export interface ZoneSchedule {
  /** Unique operation identifier */
  operationId: string;
  /** Time windows that override the default level */
  windows: Array<{
    /** Zone level during this window */
    level: ZoneLevel;
    /** 5-field cron expression for when this window starts */
    cron: string;
    /** Duration in minutes that this window remains active */
    durationMinutes: number;
  }>;
  /** Zone level when no window is active. Defaults to 'green'. */
  defaultLevel?: ZoneLevel;
}

/**
 * Service interface for resolving operational zones.
 *
 * @public
 */
export interface OperationalZoneService {
  /**
   * Resolve the current zone for a given operation ID.
   * Returns 'green' if no schedule matches — safe by default.
   */
  resolve(operationId: string): Promise<Zone>;

  /**
   * Register a schedule for an operation at runtime.
   * Useful for plugins to self-register their own timing constraints.
   */
  register(operationId: string, schedule: ZoneSchedule): void;

  /**
   * List all registered operations and their current zones.
   */
  listAll(): Promise<Zone[]>;
}
