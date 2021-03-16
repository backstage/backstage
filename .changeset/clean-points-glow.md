---
'@backstage/plugin-tech-radar': minor
---

Map description in API RadarEntry to Entry

The description in the Entry was mapped to the latest timeline entry, which is a changelog. This
change maps the description in the API to the entry. To maintain backwards compatibility it
will set the description to the last timeline entry if no description exists at the entry level.
