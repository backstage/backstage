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

/**
 * Allows listeners to wait for changes to happen in the database.
 *
 * @remarks
 *
 * This is the "public" facing interface used by the model layer.
 */
export interface ChangeListener {
  /**
   * Set up a listener for changes in the database.
   *
   * @remarks
   *
   * Setting up a listener is cheap. You should set it up "eagerly", even before
   * performing an initial read that might or might not turn out to return any
   * data. That way you will be sure that no events are missed in the time
   * between that initial read and starting to listen for changes.
   *
   * The checker is used to determine whether data is ready (as deterined by the
   * caller), and is called zero or more times as the underlying database is
   * determined to have changes worth inspecting.
   *
   * It is important that the signal passed in gets marked as aborted as soon as
   * you are finished with the listener, because that releases all resources
   * associated with the listener.
   */
  setupListener(options: SetupListenerOptions): Promise<{
    /**
     * Blocks until there are any updates, or the operation is aborted, or a
     * pre-set timeout occurs - whichever happens first.
     *
     * This method can be called repeatedly if needed.
     */
    waitForUpdate(): Promise<'timeout' | 'aborted' | 'ready'>;
  }>;
}

export interface SetupListenerOptions {
  /**
   * A function that returns true if data is ready.
   */
  checker: () => Promise<boolean>;
  /**
   * A signal to abort the listener.
   */
  signal: AbortSignal;
}

/**
 * Underyling lower level engine for detecting changes.
 *
 * @remarks
 *
 * This provides "raw" change detection of the events table (for any reason) and
 * then the higher level ChangeListener implementation can check whether the new
 * contents of the table fulfill the reader's needs.
 *
 * One important function of the engines is that they maintain a constant amount
 * of actual database work, no matter how many listeners there are for the
 * outcomes of that work. So they shield the rest of the system from rising
 * costs of change detection under load.
 */
export interface ChangeEngine {
  setupListener(
    signal: AbortSignal,
  ): Promise<{ waitForUpdate(): Promise<void> }>;
}
