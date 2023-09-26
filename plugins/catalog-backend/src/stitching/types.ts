/*
 * Copyright 2023 The Backstage Authors
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
 * Performs the act of stitching - to take all of the various outputs from the
 * ingestion process, and stitching them together into the final entity JSON
 * shape.
 */
export interface Stitcher {
  stitch(options: {
    entityRefs?: Iterable<string>;
    entityIds?: Iterable<string>;
  }): Promise<void>;
}

/**
 * The strategies supported by the stitching process, in terms of when to
 * perform stitching.
 *
 * @remarks
 *
 * In immediate mode, stitching happens "in-band" (blocking) immediately when
 * each processing task finishes.
 */
export type StitchingStrategy = {
  mode: 'immediate';
};
