/*
 * Copyright 2021 The Backstage Authors
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
import { writeFileSync, readFileSync, PathLike } from 'fs';
import { parse, parseDocument, visit } from 'yaml';

type Params = {
  ldapHostUrl: string;
  bindDn: string;
};

export const patchAppConfig =
  ({ bindDn, ldapHostUrl }: Params) =>
  (
    filePath: string,
    readFile: (
      path: PathLike | number,
      options: { encoding: BufferEncoding; flag?: string } | BufferEncoding,
    ) => string = readFileSync,
    writeFile = writeFileSync,
  ) => {
    const appConfig = readFile(filePath, 'utf-8');
    const doc = parseDocument(appConfig);
    const config = parse(appConfig);
    const locationsNode = doc.createNode({
      type: 'ldap-org',
      target: ldapHostUrl,
    });
    const ldapProcessor = {
      providers: [
        {
          target: ldapHostUrl,
          bind: { dn: bindDn, secret: '${LDAP_SECRET}' },
          users: {
            dn: 'Base DN to search for users goes here',
            options: { filter: '(uid=*)' },
          },
          map: { description: 'A user' },
          groups: {
            dn: 'Base DN to search for groups goes here',
            options: {
              filter: '(&(objectClass=some-group-class)(!(groupType=email)))',
            },
            map: { description: 'A group' },
          },
        },
      ],
    };
    const processorsNode = doc.createNode(ldapProcessor);

    visit(doc, {
      Pair: (_, pair) => {
        if (!pair.key) {
          return visit.SKIP;
        }
        // @ts-expect-error because `value` can be anything.
        if (config.catalog.locations && pair.key.value === 'locations') {
          // @ts-expect-error because `value` can be anything.
          pair.value.items.push(locationsNode);
          return visit.SKIP;
        }

        return undefined;
      },
    });

    visit(doc, {
      Pair: (_, pair) => {
        if (!pair.key) {
          return visit.SKIP;
        }
        // @ts-expect-error because `value` can be anything.
        if (pair.key.value !== 'catalog') {
          return visit.SKIP;
        }

        // @ts-expect-error because `value` can be anything.
        const doWeAlreadyHaveProcessors = pair.value.items.find(
          i => i.key.value === 'processors',
        );
        if (doWeAlreadyHaveProcessors) {
          // @ts-expect-error because `value` can be anything.
          visit(pair.value, {
            Pair: (__, subpair) => {
              if (!subpair.key) {
                return visit.SKIP;
              }

              // @ts-expect-error because `value` can be anything.
              if (subpair.key.value !== 'processors') {
                return visit.SKIP;
              }

              // @ts-expect-error because `value` can be anything.
              subpair.value.set('ldapOrg', processorsNode);
              return visit.SKIP;
            },
          });
          return visit.SKIP;
        }
        // @ts-expect-error because `value` can be anything.
        pair.value.items.push(
          doc.createPair(
            'processors',
            doc.createPair('ldapOrg', doc.createNode(ldapProcessor)),
          ),
        );
        return visit.SKIP;
      },
    });

    const output = doc.toString();
    writeFile(filePath, output);
    return output;
  };
