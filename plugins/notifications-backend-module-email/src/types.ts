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
export interface TransportConfig {
  transport: 'smtp' | 'ses' | 'sendmail';
}

export interface SmtpTransportConfig extends TransportConfig {
  transport: 'smtp';
  /**
   * SMTP server hostname
   */
  hostname: string;
  /**
   * SMTP server port
   */
  port: number;
  /**
   * Use secure connection for SMTP, defaults to false
   */
  secure?: boolean;
  /**
   * Require TLS for SMTP connection, defaults to false
   */
  requireTls?: boolean;
  /**
   * SMTP username
   */
  username?: string;
  /**
   * SMTP password
   * @visibility secret
   */
  password?: string;
}

export interface SesTransportConfig extends TransportConfig {
  transport: 'ses';
  /**
   * SES ApiVersion to use, defaults to 2010-12-01
   */
  apiVersion?: string;
  /**
   * SES region to use
   */
  region?: string;
  /**
   * AWS access key id
   */
  accessKeyId?: string;
  /**
   * AWS secret access key
   * @visibility secret
   */
  secretAccessKey?: string;
}

export interface SendmailTransportConfig extends TransportConfig {
  transport: 'sendmail';
  /**
   * Sendmail binary path, defaults to /usr/sbin/sendmail
   */
  path?: string;
  /**
   * Newline style, defaults to 'unix'
   */
  newline?: string;
}
