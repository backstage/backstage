ConfluenceCollator.ts reference

```ts
import { DocumentCollator } from '@backstage/plugin-search-common';
import fetch from 'cross-fetch';

export class ConfluenceCollator implements DocumentCollator {
  public readonly type: string = 'confluence';

  async execute() {
    const ConfluenceUrlBase =
      'https://{CONFLUENCE-ORG-NAME}.atlassian.net/wiki/rest/api';

    async function getConfluenceData(requestUrl: string) {
      var emptyJson = {};
      try {
        const res = await fetch(requestUrl, {
          method: 'get',
          headers: {
            Authorization: `Basic ${process.env.CONFLUENCE_TOKEN}`,
          },
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.error(err);
      }
      return emptyJson;
    }

    async function getSpaces(): Promise<string[]> {
      const data = await getConfluenceData(
        `${ConfluenceUrlBase}/space?&limit=1000&type=global&status=current`,
      );
      let spacesList = [];
      if (data['results']) {
        const results = data['results'];
        for (const result of results) {
          spacesList.push(result['key']);
        }
      }
      return spacesList;
    }

    async function getDocumentsFromSpaces(spaces: string[]): Promise<string[]> {
      let documentsList = [];
      for (var space of spaces) {
        let next = true;
        let requestUrl = `${ConfluenceUrlBase}/content?limit=1000&status=current&spaceKey=${space}`;
        while (next) {
          const data = await getConfluenceData(requestUrl);
          if (data['results']) {
            const results = data['results'];
            for (const result of results) {
              documentsList.push(result['_links']['self']);
            }
            if (data['_links']['next']) {
              requestUrl = data['_links']['base'] + data['_links']['next'];
            } else {
              next = false;
            }
          } else {
            break;
          }
        }
      }
      return documentsList;
    }

    async function getDocumentInfo(documents: string[]) {
      let documentInfo = [];
      for (var documentUrl of documents) {
        const data = await getConfluenceData(
          documentUrl + '?expand=body.storage',
        );
        if (data['status'] && data['status'] == 'current') {
          const documentMetaData = {
            title: data['title'],
            text: data['body']['storage']['value'],
            location: data['_links']['base'] + data['_links']['webui'],
          };
          documentInfo.push(documentMetaData);
        }
      }
      return documentInfo;
    }

    const spacesList = await getSpaces();
    const documentsList = await getDocumentsFromSpaces(spacesList);
    const documentMetaDataList = await getDocumentInfo(documentsList);
    return documentMetaDataList;
  }
}
```
