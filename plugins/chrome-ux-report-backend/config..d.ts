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
/**
 * ChromeUXReport schema below is an abstract of what's used within chrome-ux-report-backend
 */
export interface Config {
  /**
   * Configuration options for the chrome-ux-report-backend plugin
   */
  chromeUXReport: {
    /**
     * ChromeUXReport UXMetrics information
     */
    UXMetrics: {
      type:
        | 'first_paint'
        | 'first_contentful_paint'
        | 'largest_contentful_paint'
        | 'dom_content_loaded'
        | 'onload'
        | 'first_input.delay'
        | 'layout_instability.cumulative_layout_shift'
        | 'experimental.time_to_first_byte';
    };
  };
}
