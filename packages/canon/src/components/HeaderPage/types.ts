/*
 * Copyright 2024 The Backstage Authors
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
 * Props for the main HeaderPage component.
 *
 * @public
 */
export interface HeaderPageProps {
  title?: string;
  description?: string;
  tabs?: HeaderPageTab[];
  options?: HeaderPageOption[];
}

/**
 * Represents a tab item in the header page.
 *
 * @public
 */
export interface HeaderPageTab {
  label: string;
  href?: string;
}

/**
 * Represents an option item in the header page.
 *
 * @public
 */
export interface HeaderPageOption {
  label: string;
  value: string;
  onClick?: () => void;
}
