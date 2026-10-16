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

interface Killable {
  kill(signal?: NodeJS.Signals): unknown;
}

const SIGNAL_EXIT_CODES = { SIGINT: 130, SIGTERM: 143 } as const;
const FORCE_KILL_TIMEOUT_MS = 5000;

/**
 * Coordinates shutting down a repo run when the user interrupts it.
 *
 * Child processes spawned through cli-common register their own signal
 * listeners, which keeps Node from exiting and treats a child that was killed
 * by a signal as a success. This takes over: on the first SIGINT or SIGTERM it
 * stops new work from being scheduled, kills the running children, and exits
 * with the conventional signal exit code once they are gone. A second signal
 * exits immediately.
 *
 * @internal
 */
export class RunInterrupt {
  readonly #children = new Set<Killable>();
  readonly #exit: (code: number) => void;
  #signal?: keyof typeof SIGNAL_EXIT_CODES;

  constructor(exit: (code: number) => void = code => process.exit(code)) {
    this.#exit = exit;
  }

  /** True once an interrupt signal has been received */
  get interrupted(): boolean {
    return this.#signal !== undefined;
  }

  /** Starts listening for signals, returns a function that stops listening */
  install(): () => void {
    const onSigint = () => this.handleSignal('SIGINT');
    const onSigterm = () => this.handleSignal('SIGTERM');
    process.on('SIGINT', onSigint);
    process.on('SIGTERM', onSigterm);
    return () => {
      process.removeListener('SIGINT', onSigint);
      process.removeListener('SIGTERM', onSigterm);
    };
  }

  /** Tracks a running child, returns a function to call when it has exited */
  track(child: Killable): () => void {
    this.#children.add(child);
    if (this.interrupted) {
      child.kill('SIGTERM');
    }
    return () => {
      this.#children.delete(child);
      this.#exitIfDone();
    };
  }

  handleSignal(signal: keyof typeof SIGNAL_EXIT_CODES): void {
    if (this.#signal) {
      this.#exit(SIGNAL_EXIT_CODES[this.#signal]);
      return;
    }
    this.#signal = signal;
    for (const child of this.#children) {
      child.kill('SIGTERM');
    }
    if (this.#children.size > 0) {
      setTimeout(() => {
        for (const child of this.#children) {
          child.kill('SIGKILL');
        }
        this.#exit(SIGNAL_EXIT_CODES[signal]);
      }, FORCE_KILL_TIMEOUT_MS).unref();
    }
    this.#exitIfDone();
  }

  #exitIfDone() {
    if (this.#signal && this.#children.size === 0) {
      this.#exit(SIGNAL_EXIT_CODES[this.#signal]);
    }
  }
}
