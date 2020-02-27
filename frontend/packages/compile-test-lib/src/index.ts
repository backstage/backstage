import { getPartialMessage } from 'compile-test-lib-2';

export function getMessage(): string {
  return `<lib> ${getPartialMessage()} </lib>`;
}
