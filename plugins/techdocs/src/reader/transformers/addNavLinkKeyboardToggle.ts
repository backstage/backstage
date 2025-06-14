/*
 * Copyright 2020 The Backstage Authors
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

export function addNavLinkKeyboardToggle() {
  return (element: Element) => {
    const navLabels = element.querySelectorAll('label.md-nav__link[for]');
    navLabels.forEach(label => {
      label.setAttribute('tabIndex', '0');
      label.addEventListener('keydown', event => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          const forId = label.getAttribute('for');
          if (!forId) return;
          const checkbox = element.querySelector(
            `#${forId}`,
          ) as HTMLInputElement | null;
          if (checkbox && checkbox.type === 'checkbox') {
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            event.preventDefault();
            event.stopPropagation();
          }
        }
      });
    });
    return element;
  };
}
