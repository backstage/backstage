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

/**
 * Vendored from Create React App (react-dev-utils/openBrowser.js).
 * Original: https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openBrowser.js
 *
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Changes from upstream:
 * - Replaced chalk with Node built-in styleText (node:util)
 * - Inlined AppleScript: openChrome.applescript is embedded as a string and written to a temp file on macOS, then unlinked; no separate .applescript file.
 * - Process check on macOS: original uses "ps cax | grep <browser>"; we use "pgrep -f <browser>" for the same purpose (avoids separate grep process and argument escaping).
 * - open() options: original used url: true; removed in open v8, deprecated in v7.2
 * - Make open an optional peer dependency
 * - Ported to TypeScript with basic types; same API openBrowser(url: string): boolean.
 *
 * -----------------------------------------------------------------------
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { styleText } from 'node:util';
import spawn from 'cross-spawn';
import { loadOpen } from './loadOpen';

// https://github.com/sindresorhus/open#app
const OSX_CHROME = 'google chrome';

const Actions = {
  NONE: 0,
  BROWSER: 1,
  SCRIPT: 2,
} as const;

function getBrowserEnv(): {
  action: (typeof Actions)[keyof typeof Actions];
  value: string | undefined;
  args: string[];
} {
  // Attempt to honor this environment variable.
  // It is specific to the operating system.
  // See https://github.com/sindresorhus/open#app for documentation.
  const value = process.env.BROWSER;
  const args = process.env.BROWSER_ARGS
    ? process.env.BROWSER_ARGS.split(' ')
    : [];
  let action: (typeof Actions)[keyof typeof Actions];
  if (!value) {
    // Default.
    action = Actions.BROWSER;
  } else if (value.toLowerCase().endsWith('.js')) {
    action = Actions.SCRIPT;
  } else if (value.toLowerCase() === 'none') {
    action = Actions.NONE;
  } else {
    action = Actions.BROWSER;
  }
  return { action, value, args };
}

// Embedded openChrome.applescript from Create React App (MIT). Original:
// https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/openChrome.applescript
const OPEN_CHROME_APPLESCRIPT = `(*
Copyright (c) 2015-present, Facebook, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*)

property targetTab: null
property targetTabIndex: -1
property targetWindow: null
property theProgram: "Google Chrome"

on run argv
  set theURL to item 1 of argv

  -- Allow requested program to be optional,
  -- default to Google Chrome
  if (count of argv) > 1 then
    set theProgram to item 2 of argv
  end if

  using terms from application "Google Chrome"
    tell application theProgram

      if (count every window) = 0 then
        make new window
      end if

      -- 1: Looking for tab running debugger
      -- then, Reload debugging tab if found
      -- then return
      set found to my lookupTabWithUrl(theURL)
      if found then
        set targetWindow's active tab index to targetTabIndex
        tell targetTab to reload
        tell targetWindow to activate
        set index of targetWindow to 1
        return
      end if

      -- 2: Looking for Empty tab
      -- In case debugging tab was not found
      -- We try to find an empty tab instead
      set found to my lookupTabWithUrl("chrome://newtab/")
      if found then
        set targetWindow's active tab index to targetTabIndex
        set URL of targetTab to theURL
        tell targetWindow to activate
        return
      end if

      -- 3: Create new tab
      -- both debugging and empty tab were not found
      -- make a new tab with url
      tell window 1
        activate
        make new tab with properties {URL:theURL}
      end tell
    end tell
  end using terms from
end run

-- Function:
-- Lookup tab with given url
-- if found, store tab, index, and window in properties
-- (properties were declared on top of file)
on lookupTabWithUrl(lookupUrl)
  using terms from application "Google Chrome"
    tell application theProgram
      -- Find a tab with the given url
      set found to false
      set theTabIndex to -1
      repeat with theWindow in every window
        set theTabIndex to 0
        repeat with theTab in every tab of theWindow
          set theTabIndex to theTabIndex + 1
          if (theTab's URL as string) contains lookupUrl then
            -- assign tab, tab index, and window to properties
            set targetTab to theTab
            set targetTabIndex to theTabIndex
            set targetWindow to theWindow
            set found to true
            exit repeat
          end if
        end repeat

        if found then
          exit repeat
        end if
      end repeat
    end tell
  end using terms from
  return found
end lookupTabWithUrl
`;

function executeNodeScript(scriptPath: string, url: string): boolean {
  const extraArgs = process.argv.slice(2);
  const child = spawn(process.execPath, [scriptPath, ...extraArgs, url], {
    stdio: 'inherit',
  });
  child.on('close', code => {
    if (code !== 0) {
      console.log();
      console.log(
        styleText(
          'red',
          'The script specified as BROWSER environment variable failed.',
        ),
      );
      console.log(`${styleText('cyan', scriptPath)} exited with code ${code}.`);
      console.log();
    }
  });
  return true;
}

function startBrowserProcess(
  browser: string | undefined,
  url: string,
  args: string[],
): boolean {
  // If we're on OS X, the user hasn't specifically
  // requested a different browser, we can try opening
  // Chrome with AppleScript. This lets us reuse an
  // existing tab when possible instead of creating a new one.
  const shouldTryOpenChromiumWithAppleScript =
    process.platform === 'darwin' &&
    (typeof browser !== 'string' || browser === OSX_CHROME);

  if (shouldTryOpenChromiumWithAppleScript) {
    // Will use the first open browser found from list
    const supportedChromiumBrowsers = [
      'Google Chrome Canary',
      'Google Chrome Dev',
      'Google Chrome Beta',
      'Google Chrome',
      'Microsoft Edge',
      'Brave Browser',
      'Vivaldi',
      'Chromium',
    ];

    const tmpDir = os.tmpdir();
    const scriptPath = path.join(
      tmpDir,
      `backstage-openChrome-${process.pid}.applescript`,
    );

    for (const chromiumBrowser of supportedChromiumBrowsers) {
      try {
        // Try our best to reuse existing tab
        // on OSX Chromium-based browser with AppleScript
        // Original used: ps cax | grep "<browser>"; we use pgrep -f for the same purpose.
        execFileSync('pgrep', ['-f', chromiumBrowser], { stdio: 'ignore' });
        fs.writeFileSync(scriptPath, OPEN_CHROME_APPLESCRIPT, 'utf8');
        try {
          execFileSync(
            'osascript',
            [scriptPath, encodeURI(url), chromiumBrowser],
            {
              stdio: 'ignore',
            },
          );
          return true;
        } finally {
          try {
            fs.unlinkSync(scriptPath);
          } catch {
            // ignore
          }
        }
      } catch {
        // Ignore errors.
      }
    }
  }

  // Another special case: on OS X, check if BROWSER has been set to "open".
  // In this case, instead of passing `open` to `opn` (which won't work),
  // just ignore it (thus ensuring the intended behavior, i.e. opening the system browser):
  // https://github.com/facebook/create-react-app/pull/1690#issuecomment-283518768
  let resolvedBrowser: string | string[] | undefined = browser;
  if (process.platform === 'darwin' && browser === 'open') {
    resolvedBrowser = undefined;
  }

  // If there are arguments, they must be passed as array with the browser
  let appOption: { name: string; arguments?: readonly string[] } | undefined;
  if (typeof resolvedBrowser === 'string' && resolvedBrowser) {
    appOption =
      args.length > 0
        ? { name: resolvedBrowser, arguments: args as readonly string[] }
        : { name: resolvedBrowser };
  } else if (Array.isArray(resolvedBrowser) && resolvedBrowser.length > 0) {
    const rest = resolvedBrowser.slice(1);
    appOption = {
      name: resolvedBrowser[0],
      arguments: rest.length > 0 ? ([...rest] as readonly string[]) : undefined,
    };
  }

  // Fallback to open (ESM-only; load via dynamic import from CJS build)
  // (It will always open new tab). Outer .catch handles optional peer not installed.
  try {
    loadOpen()
      .then(m =>
        m.default(url, { app: appOption, wait: false }).catch(() => {}),
      )
      .catch(() => {});
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads the BROWSER environment variable and decides what to do with it.
 * Returns true if it opened a browser or ran a node.js script, otherwise false.
 *
 * Adapted from `react-dev-utils/openBrowser`.
 *
 * @public
 * @param url - The URL to open.
 * @returns True if it opened a browser or ran a node.js script, otherwise false.
 */
export function openBrowser(url: string): boolean {
  const { action, value, args } = getBrowserEnv();
  switch (action) {
    case Actions.NONE:
      // Special case: BROWSER="none" will prevent opening completely.
      return false;
    case Actions.SCRIPT:
      return executeNodeScript(value!, url);
    case Actions.BROWSER:
      return startBrowserProcess(value, url, args);
    default:
      throw new Error('Not implemented.');
  }
}
