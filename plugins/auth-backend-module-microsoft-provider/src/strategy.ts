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

import { PassportProfile } from '@backstage/plugin-auth-node';
import { decodeJwt } from 'jose';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';

export class ExtendedMicrosoftStrategy extends MicrosoftStrategy {
  private shouldSkipUserProfile = false;

  public setSkipUserProfile(shouldSkipUserProfile: boolean): void {
    this.shouldSkipUserProfile = shouldSkipUserProfile;
  }

  userProfile(
    accessToken: string,
    done: (err?: unknown, profile?: PassportProfile) => void,
  ): void {
    if (this.skipUserProfile(accessToken)) {
      done(null, undefined);
      return;
    }

    super.userProfile(
      accessToken,
      (err?: unknown, profile?: PassportProfile) => {
        if (!profile || profile.photos) {
          done(err, profile);
          return;
        }

        this.getProfilePhotos(accessToken).then(photos => {
          profile.photos = photos;
          done(err, profile);
        });
      },
    );
  }

  private hasGraphReadScope(accessToken: string): boolean {
    const { aud, scp } = decodeJwt(accessToken);
    return (
      aud === '00000003-0000-0000-c000-000000000000' &&
      !!scp &&
      (scp as string)
        .split(' ')
        .map(s => s.toLocaleLowerCase('en-US'))
        .some(s =>
          [
            'https://graph.microsoft.com/user.read',
            'https://graph.microsoft.com/user.read.all',
            'user.read',
            'user.read.all',
          ].includes(s),
        )
    );
  }

  private skipUserProfile(accessToken: string): boolean {
    try {
      return this.shouldSkipUserProfile || !this.hasGraphReadScope(accessToken);
    } catch {
      // If there is any error with checking the scope
      // we fall back to not skipping the user profile
      // which may still result in an auth failure
      // e.g. due to a foreign scope.
      return false;
    }
  }

  private async getProfilePhotos(
    accessToken: string,
  ): Promise<Array<{ value: string }> | undefined> {
    return this.getCurrentUserPhoto(accessToken, '96x96').then(photo =>
      photo ? [{ value: photo }] : undefined,
    );
  }

  private async getCurrentUserPhoto(
    accessToken: string,
    size: string,
  ): Promise<string | undefined> {
    try {
      const res = await fetch(
        `https://graph.microsoft.com/v1.0/me/photos/${size}/$value`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await res.arrayBuffer();

      return `data:image/jpeg;base64,${Buffer.from(data).toString('base64')}`;
    } catch (error) {
      return undefined;
    }
  }
}
