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
import { createTransport } from 'nodemailer';
import {
  EmailClient,
  EmailMessage,
  EmailRecipients,
} from '@azure/communication-email';
import { DefaultAzureCredential } from '@azure/identity';
import { Config } from '@backstage/config';
import MailMessage from 'nodemailer/lib/mailer/mail-message';

export const createAzureTransport = async (config: Config) => {
  const accessKey = config.getOptionalString('accessKey');
  const credentials =
    accessKey === undefined ? new DefaultAzureCredential() : { key: accessKey };
  const emailClient = new EmailClient(
    config.getString('endpoint'),
    credentials,
  );
  const transport = {
    name: 'azure',
    version: '1.0.0',
    send: async (
      mail: MailMessage,
      callback: (err: Error | null, info: {} | null) => Promise<void>,
    ) => {
      const envelope = mail.data.envelope || mail.message.getEnvelope();
      const from =
        typeof envelope.from === 'string'
          ? envelope.from
          : config.getString('senderAddress');
      const to =
        typeof envelope.to === 'string' ? [envelope.to] : envelope.to ?? [];
      const recipients: EmailRecipients = {
        to: to.map(address => ({ address })),
      };

      const content = {
        subject: mail.message.getHeader('Subject'),
        html:
          typeof mail.data.html === 'string'
            ? mail.data.html
            : mail.data.html?.toString('utf-8'),
        plainText:
          typeof mail.data.text === 'string'
            ? mail.data.text
            : mail.data.text?.toString('utf-8') ?? 'No content',
      };

      const emailMessage: EmailMessage = {
        senderAddress: from,
        recipients: recipients,
        content: content,
      };

      try {
        const poller = await emailClient.beginSend(emailMessage);
        const response = await poller.pollUntilDone();
        callback(null, response);
      } catch (error) {
        callback(error, null);
      }
    },
  };
  return createTransport(transport);
};
