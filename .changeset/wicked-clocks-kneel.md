---
'@backstage/plugin-home': patch
---

Added HeaderWorldClock to the Home plugin which is a copy of the HomepageTimer from core-components that has been updated to use props over static config from app-config.yaml. To use HeaderWorlClock you'll need to create an array of ClockConfig like this:

```ts
const clockConfigs: ClockConfig[] = [
  {
    label: 'NYC',
    timeZone: 'America/New_York',
  },
  {
    label: 'UTC',
    timeZone: 'UTC',
  },
  {
    label: 'STO',
    timeZone: 'Europe/Stockholm',
  },
  {
    label: 'TYO',
    timeZone: 'Asia/Tokyo',
  },
];
```

Then you can pass `clockConfigs` into the HeaderWorldClock like this:

```ts
<Page themeId="home">
  <Header title="Home">
    <HeaderWorldClock clockConfigs={clockConfigs} />
  </Header>
  <Content>// ...</Content>
</Page>
```
