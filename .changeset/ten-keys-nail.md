---
'@backstage/backend-defaults': patch
---

Fixed an issue in the WinstonLogger where Errors thrown and given to logger.error with field values that could not be cast to a string would throw a TypeError
