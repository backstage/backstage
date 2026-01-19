/*
 * Copyright 2025 The Backstage Authors
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
import { JsonValue } from '@backstage/types';

/**
 * The status of a checkpoint, indicating whether it succeeded or failed.
 *
 * @alpha
 */
export type CheckpointStatus = 'failed' | 'success';

/**
 * Represents the union of all possible checkpoint state values.
 *
 * @alpha
 */
export type CheckpointStateValue<T extends JsonValue = JsonValue> =
  | { status: 'failed'; reason: string }
  | { status: 'success'; value: T };

/**
 * A map of checkpoint keys to their states.
 *
 * @alpha
 */
export type CheckpointState = {
  [key: string]: CheckpointStateValue;
};

/**
 * Context for checkpoint function invocation.
 *
 * The value returned by `fn` will be serialized to JSON for storage.
 * Non-serializable values (functions, symbols, circular references, etc.)
 * will be safely handled - they are stripped or replaced during serialization.
 *
 * @alpha
 */
export type CheckpointContext<T = unknown> = {
  /**
   * Unique key for the checkpoint
   */
  key: string;
  /**
   * Function to execute for the checkpoint.
   * The return value will be JSON-serialized for storage.
   */
  fn: () => Promise<T> | T;
};
