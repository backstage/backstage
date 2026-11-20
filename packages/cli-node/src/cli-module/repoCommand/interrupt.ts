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

interface TrackedChild {
  pid?: number;
  kill(signal?: NodeJS.Signals): unknown;
}

const SIGNAL_EXIT_CODES = { SIGINT: 130, SIGTERM: 143 } as const;

/** Kills the whole process group of a child that was spawned detached */
function killProcessGroup(child: TrackedChild) {
  try {
    // Process groups are not supported on Windows
    if (child.pid && process.platform !== 'win32') {
      process.kill(-child.pid, 'SIGKILL');
    } else {
      child.kill('SIGKILL');
    }
  } catch (error) {
    // ESRCH means that the group is already gone, which is what we want
    if ((error as NodeJS.ErrnoException).code !== 'ESRCH') {
      throw error;
    }
  }
}

/**
 * Coordinates shutting down a repo run when the user interrupts it.
 *
 * Child processes spawned through cli-common register their own signal
 * listeners, which keeps Node from exiting and treats a child that was killed
 * by a signal as a success. This takes over: on the first SIGINT or SIGTERM it
 * stops new work from being scheduled, immediately kills the process group of
 * every running child, and exits with the conventional signal exit code
 * without waiting. On platforms with process groups the children must be
 * spawned detached, so that each one is the leader of its own group, which
 * also takes down their worker processes.
 *
 * @internal
 */
export class RunInterrupt {
  readonly #children = new Set<TrackedChild>();
  readonly #listeners = new Set<() => void>();
  readonly #exit: (code: number) => void;
  #signal?: keyof typeof SIGNAL_EXIT_CODES;

  constructor(exit: (code: number) => void = code => process.exit(code)) {
    this.#exit = exit;
  }

  /** True once an interrupt signal has been received */
  get interrupted(): boolean {
    return this.#signal !== undefined;
  }

  /**
   * Starts listening for signals. Also kills any remaining child groups when
   * the process exits, since detached children do not receive the signals of
   * the terminal. Returns a function that stops listening.
   */
  install(): () => void {
    const onSigint = () => this.handleSignal('SIGINT');
    const onSigterm = () => this.handleSignal('SIGTERM');
    const onExit = () => this.#killAll();
    process.on('SIGINT', onSigint);
    process.on('SIGTERM', onSigterm);
    process.on('exit', onExit);
    return () => {
      process.removeListener('SIGINT', onSigint);
      process.removeListener('SIGTERM', onSigterm);
      process.removeListener('exit', onExit);
    };
  }

  /** Tracks a running child, returns a function to call when it has exited */
  track(child: TrackedChild): () => void {
    this.#children.add(child);
    if (this.interrupted) {
      killProcessGroup(child);
    }
    return () => {
      this.#children.delete(child);
    };
  }

  /** Registers a callback that runs on interrupt, right before exiting */
  onInterrupt(listener: () => void): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  handleSignal(signal: keyof typeof SIGNAL_EXIT_CODES): void {
    if (this.#signal) {
      this.#exit(SIGNAL_EXIT_CODES[this.#signal]);
      return;
    }
    this.#signal = signal;
    this.#killAll();
    for (const listener of this.#listeners) {
      listener();
    }
    this.#exit(SIGNAL_EXIT_CODES[signal]);
  }

  #killAll() {
    for (const child of this.#children) {
      killProcessGroup(child);
    }
    this.#children.clear();
  }
}
