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

import express from 'express';
import Router from 'express-promise-router';
import fetch from 'cross-fetch';
// @ts-ignore
import SaxonJS from 'saxon-js';
import styleSheet from '../stylesheet.sef.json';

const downloadExternalSchema = (uri: string) => {
  return fetch(uri)
    .then(value => value.text())
    .catch(
      () =>
        `<?xml version="1.0" encoding="UTF-8"?><Error>Could not download external schema!</Error>`,
    );
};

// Do to a bug in SaxonJS we have to remove the port else the
// document can't be found by the URL in the documentPool.
const removePort = (uri: string) => {
  const url = new URL(uri);
  url.port = '';
  return url.toString();
};

const wsdlToHtml = async (xml: string) => {
  const saxonDocument = await SaxonJS.getResource({ text: xml, type: 'xml' });

  const schemaURIs: Array<{ value: string }> =
    SaxonJS.XPath.evaluate(
      "//*[local-name() = 'import'][@location]/@location|//*[@schemaLocation]/@schemaLocation",
      saxonDocument,
      { resultForm: 'array' },
    ) || [];

  const externalSchemas = await Promise.all(
    schemaURIs.map(async schemaURI =>
      SaxonJS.getResource({
        text: await downloadExternalSchema(schemaURI.value),
        type: 'xml',
      }),
    ),
  );

  const documentPool: { [name: string]: string } = {};
  for (let i = 0; i < externalSchemas.length; i++) {
    documentPool[removePort(schemaURIs[i].value)] = externalSchemas[i];
  }

  return SaxonJS.transform(
    {
      stylesheetText: JSON.stringify(styleSheet),
      sourceText: xml,
      sourceBaseURI: 'https://backstage.io', // Needs to be set to anything
      documentPool: documentPool,
      destination: 'serialized',
      logLevel: 10,
    },
    'async',
  ).then((output: { principalResult: string }) => output.principalResult);
};

/** @public */
export async function createRouter(): Promise<express.Router> {
  const router = Router();
  router.use(express.text());

  router.post('/v1/convert', async (req, res) => {
    const result = await wsdlToHtml(req.body.toString());
    res.send(result);
  });

  return router;
}
