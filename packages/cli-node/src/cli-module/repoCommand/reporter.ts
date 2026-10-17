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

import chalk from 'chalk';

/** @internal */
export type PackageStatus = 'PASS' | 'FAIL' | 'INTERRUPTED' | 'CACHED';

/**
 * Presents the progress of a repo run.
 *
 * @internal
 */
export interface RunReporter {
  /** Called once with the names of all packages that will run */
  begin(names: string[]): void;
  onStart(name: string): void;
  onOutput(name: string, data: Buffer): void;
  onFinish(name: string, status: PackageStatus): void;
  /** Called instead of onStart and onFinish for a package that is skipped due to a cache hit */
  onCached(name: string): void;
  /** Prints a message that must always be visible */
  message(text: string): void;
  /** Called when the run is interrupted, shows running packages as interrupted */
  interrupt(): void;
  /** Called when all packages are done, releases any terminal state */
  end(): void;
}

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const SPINNER_INTERVAL_MS = 80;

function statusLabel(status: PackageStatus): string {
  switch (status) {
    case 'PASS':
      return chalk.green('PASS');
    case 'CACHED':
      return chalk.cyan('CACHED');
    case 'FAIL':
      return chalk.red('FAIL');
    default:
      return chalk.yellow('INTERRUPTED');
  }
}

/**
 * Streams the output of each package as it arrives, with a name prefix on
 * every line.
 */
class VerboseReporter implements RunReporter {
  readonly #partial = new Map<string, string>();
  readonly #running = new Set<string>();

  constructor(private readonly write: (text: string) => void) {}

  begin() {}

  onStart(name: string) {
    this.#running.add(name);
  }

  onOutput(name: string, data: Buffer) {
    const text = (this.#partial.get(name) ?? '') + data.toString();
    const lines = text.split(/\r?\n/);
    this.#partial.set(name, lines.pop() ?? '');
    if (lines.length > 0) {
      this.write(lines.map(line => `[${name}] ${line}\n`).join(''));
    }
  }

  onFinish(name: string, status: PackageStatus) {
    this.#running.delete(name);
    const rest = this.#partial.get(name);
    this.#partial.delete(name);
    if (rest) {
      this.write(`[${name}] ${rest}\n`);
    }
    this.write(`[${name}] ${statusLabel(status)}\n`);
  }

  onCached(name: string) {
    this.onFinish(name, 'CACHED');
  }

  message(text: string) {
    this.write(`${text}\n`);
  }

  interrupt() {
    for (const name of this.#running) {
      this.onFinish(name, 'INTERRUPTED');
    }
  }

  end() {}
}

/** Prints one line for each finished package, used when not on a terminal. */
class LineReporter implements RunReporter {
  #total = 0;
  #done = 0;
  readonly #running = new Set<string>();

  constructor(private readonly write: (text: string) => void) {}

  begin(names: string[]) {
    this.#total = names.length;
    this.#done = 0;
  }

  onStart(name: string) {
    this.#running.add(name);
  }

  onOutput() {}

  onFinish(name: string, status: PackageStatus) {
    this.#running.delete(name);
    this.#done += 1;
    this.write(
      `${statusLabel(status)} ${name} (${this.#done}/${this.#total})\n`,
    );
  }

  onCached(name: string) {
    this.onFinish(name, 'CACHED');
  }

  message(text: string) {
    this.write(`${text}\n`);
  }

  interrupt() {
    for (const name of this.#running) {
      this.onFinish(name, 'INTERRUPTED');
    }
  }

  end() {}
}

/**
 * Redraws a block in place on a terminal, with a summary line and one line
 * for each running package. Failures are printed above the block as they
 * happen so that they stay in the scrollback.
 */
class LiveReporter implements RunReporter {
  readonly #running = new Set<string>();
  #queued = 0;
  #passed = 0;
  #cached = 0;
  #failed = 0;
  #interrupted = 0;
  #frame = 0;
  #drawnLines = 0;
  #timer?: NodeJS.Timeout;

  constructor(private readonly write: (text: string) => void) {}

  begin(names: string[]) {
    this.#queued = names.length;
    this.#passed = 0;
    this.#cached = 0;
    this.#failed = 0;
    this.#interrupted = 0;
    this.#timer = setInterval(() => {
      this.#frame += 1;
      this.#draw();
    }, SPINNER_INTERVAL_MS);
    this.#timer.unref();
    this.#draw();
  }

  onStart(name: string) {
    this.#queued -= 1;
    this.#running.add(name);
    this.#draw();
  }

  onOutput() {}

  onCached() {
    this.#queued -= 1;
    this.#cached += 1;
    this.#draw();
  }

  onFinish(name: string, status: PackageStatus) {
    this.#running.delete(name);
    if (status === 'PASS') {
      this.#passed += 1;
      this.#draw();
      return;
    }
    if (status === 'FAIL') {
      this.#failed += 1;
    } else {
      this.#interrupted += 1;
    }
    this.#print(`${statusLabel(status)} ${name}\n`);
  }

  message(text: string) {
    this.#print(`${text}\n`);
  }

  interrupt() {
    this.#stop();
    for (const name of this.#running) {
      this.#interrupted += 1;
      this.write(`${statusLabel('INTERRUPTED')} ${name}\n`);
    }
    this.#running.clear();
    this.#queued = 0;
    this.write(`${this.#summary()}\n`);
  }

  end() {
    this.#stop();
    this.write(`${this.#summary()}\n`);
  }

  #stop() {
    if (this.#timer) {
      clearInterval(this.#timer);
      this.#timer = undefined;
    }
    this.#clear();
  }

  #print(text: string) {
    this.#clear();
    this.write(text);
    this.#draw();
  }

  #clear() {
    if (this.#drawnLines > 0) {
      this.write(`\x1b[${this.#drawnLines}A\x1b[0J`);
      this.#drawnLines = 0;
    }
  }

  #summary(): string {
    return [
      chalk.green(`${this.#passed} passed`),
      ...(this.#cached > 0 ? [chalk.cyan(`${this.#cached} cached`)] : []),
      this.#failed > 0 ? chalk.red(`${this.#failed} failed`) : '0 failed',
      ...(this.#interrupted > 0
        ? [chalk.yellow(`${this.#interrupted} interrupted`)]
        : []),
      ...(this.#running.size > 0 ? [`${this.#running.size} running`] : []),
      ...(this.#queued > 0 ? [`${this.#queued} queued`] : []),
    ].join(' · ');
  }

  #draw() {
    this.#clear();
    const spinner = chalk.cyan(
      SPINNER_FRAMES[this.#frame % SPINNER_FRAMES.length],
    );
    const lines = [
      this.#summary(),
      ...Array.from(this.#running).map(name => `  ${spinner} ${name}`),
    ];
    this.write(`${lines.join('\n')}\n`);
    this.#drawnLines = lines.length;
  }
}

/** @internal */
export function createReporter(options: {
  verbose: boolean;
  isTTY: boolean;
  write: (text: string) => void;
}): RunReporter {
  if (options.verbose) {
    return new VerboseReporter(options.write);
  }
  return options.isTTY
    ? new LiveReporter(options.write)
    : new LineReporter(options.write);
}
