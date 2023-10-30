---
'@backstage/plugin-playlist': minor
---

Support being able to define custom composable Playlist index pages

**BREAKING** The individual `PlaylistPage` route must now be manually hooked up by making the following change to your setup:

```diff
-import { PlaylistIndexPage } from '@backstage/plugin-playlist';
+import { PlaylistIndexPage, PlaylistPage } from '@backstage/plugin-playlist';

// ...

 <Route path="/playlist" element={<PlaylistIndexPage />} />
+<Route path="/playlist/:playlistId" element={<PlaylistPage />} />
```
