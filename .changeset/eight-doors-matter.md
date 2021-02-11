---
'@backstage/core-api': patch
'@backstage/plugin-catalog': patch
---

Minor refactoring of BackstageApp.getSystemIcons to support custom registered
icons. Custom Icons can be added using:

```tsx
import AlarmIcon from '@material-ui/icons/Alarm';
import MyPersonIcon from './MyPerson';

const app = createApp({
  icons: {
    user: MyPersonIcon // override system icon
    alert: AlarmIcon, // Custom icon
  },
});
```
