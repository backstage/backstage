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

import { API_KEY, CLIENT_ID } from './config';

// Using the Google API Client Library for JavaScript
//  https://github.com/google/google-api-javascript-client

export const api = {
  init() {
    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        document.body.appendChild(script);

        const initClient = async () => {
          await window.gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            scope: 'profile',
            discoveryDocs: [
              'https://analytics.googleapis.com/$discovery/rest?version=v3',
              'https://people.googleapis.com/$discovery/rest?version=v1',
            ],
          });
          await window.gapi.signin2.render('loginButton', {
            longtitle: true,
            theme: 'dark',
          });
          const loginButton = document.getElementById('loginButton');
          loginButton.style.display = 'block';

          resolve();
        };

        const handleClientLoad = () => {
          window.gapi.load('client:auth2:signin2', initClient);
        };

        script.onload = () => {
          handleClientLoad();
        };
      } catch (e) {
        reject(e);
      }
    });
  },
  getGaData(query) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await window.gapi.client.analytics.data.ga.get(query);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  },
  isSignedIn() {
    return window.gapi.auth2.getAuthInstance().isSignedIn.get();
  },
  listAccounts() {
    return new Promise(async (resolve, reject) => {
      try {
        const request = window.gapi.client.analytics.management.accounts.list();
        const data = new Promise((res, rej) => {
          request.execute(results => {
            if (results && !results.error) {
              res(results);
            }
            if (results.error) {
              rej(results.error);
            }
          });
        });
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  },
  listViews(accountId) {
    return new Promise(async (resolve, reject) => {
      try {
        const request = window.gapi.client.analytics.management.profiles.list({
          accountId: accountId,
          webPropertyId: '~all',
        });
        const data = new Promise((res, rej) => {
          request.execute(results => {
            if (results && !results.error) {
              res(results);
            }
            if (results.error) {
              rej(results.error);
            }
          });
        });
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  },
};

export default api;
