---
'@backstage/plugin-catalog-react': patch
---

fixes bug related to qs library upgrade. makes the EntityListProvider return the correct queryParameters even when there are more than 20 occurences of the same value
