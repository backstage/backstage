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

// Parameters for a ring; its index in an array determines how close to the center this ring is.
export type Ring = {
  id: string;
  idx?: number;
  name: string;
  color: string;
};

// Parameters for a quadrant (there should be exactly 4 of course)
export type Quadrant = {
  id: string;
  idx?: number;
  name: string;
};

export type Entry = {
  id: string;
  idx?: number;
  // The quadrant where this entry belongs
  quadrant: Quadrant;
  // The ring where this entry belongs
  ring: Ring;
  // The label that's shown in the legend and on hover
  title: string;
  // An URL to a longer description as to why this entry is where it is
  url?: string;
  // How this entry has recently moved; -1 for "down", +1 for "up", 0 for not moved
  moved?: number;
};

// The same as ENTRY except quadrant/ring are declared by their string ID instead of being the actual objects
export type DeclaredEntry = Entry & {
  quadrant: string;
  ring: string;
};
