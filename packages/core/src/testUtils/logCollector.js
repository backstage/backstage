/*
 * Copyright 2020 Spotify AB
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

/* eslint-disable no-console */

// If the callback function is async this one will be too.
export function withLogCollector(logsToCollect, callback) {
  if (typeof logsToCollect === 'function') {
    callback = logsToCollect;
    logsToCollect = ['log', 'warn', 'error'];
  }
  const logs = {
    log: [],
    warn: [],
    error: [],
  };

  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;

  if (logsToCollect.includes('log')) {
    console.log = message => {
      logs.log.push(message);
    };
  }
  if (logsToCollect.includes('warn')) {
    console.warn = message => {
      logs.warn.push(message);
    };
  }
  if (logsToCollect.includes('error')) {
    console.error = message => {
      logs.error.push(message);
    };
  }

  const restore = () => {
    console.log = origLog;
    console.warn = origWarn;
    console.error = origError;
  };

  try {
    const ret = callback();

    if (!ret || !ret.then) {
      restore();
      return logs;
    }

    return ret.then(
      () => {
        restore();
        return logs;
      },
      error => {
        restore();
        throw error;
      },
    );
  } catch (error) {
    restore();
    throw error;
  }
}
