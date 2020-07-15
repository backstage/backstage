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
import { html, property, customElement, TemplateResult } from 'lit-element';
import WebComponent from '@dfds-devex/minions-core/lib/components/WebComponent';

const componentIdentifier = 'dfds-web-api';

@customElement(componentIdentifier)
export default class DfdsWebApiComponent extends WebComponent {
  @property({ type: String }) message = 'Click me!';

  constructor() {
    super({
      identifier: componentIdentifier,
    });
  }

  onClick() {
    this.dispatchEvent(
      new CustomEvent(this.identifier as string, {
        bubbles: false,
        composed: true,
        detail: this.message,
      }),
    );
  }

  render(): TemplateResult {
    return html`<button @click="${this.onClick}">${this.message}</button>`;
  }
}
