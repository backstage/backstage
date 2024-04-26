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
export default {
  'src/index.js': `import { add, multiply, subtract, divide } from \"./math\";

export default (a, b, operator) => {
  switch(operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    default:
      throw new Error('Invalid operator');
  }
};
  `,
  'src/math.js': `export function add(a, b) {
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Invalid input');
  }
  return a + b;
}

export function subtract(a, b) {
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Invalid input');
  }
  return a - b;
}

export function multiply(a, b) {
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Invalid input');
  }
  return a * b;
}

export function divide(a, b) {
  if (isNaN(a) || isNaN(b)) {
    throw new Error('Invalid input');
  } else if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}
  `,
};
