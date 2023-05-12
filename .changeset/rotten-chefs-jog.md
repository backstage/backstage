---
'@backstage/plugin-scaffolder-react': patch
'@backstage/plugin-scaffolder': patch
---

Improvements to the `scaffolder/next` buttons UX:

- Added padding around the "Create" button in the `Stepper` component
- Added a button bar that includes the "Cancel" and "Start Over" buttons to the `OngoingTask` component. The state of these buttons match their existing counter parts in the Context Menu
- Added a "Show Button Bar"/"Hide Button Bar" item to the `ContextMenu` component
