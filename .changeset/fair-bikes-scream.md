---
'@backstage/cli': minor
---

ESLint upgraded to version 8 and all it's plugins updated to newest version.

If you use any custom plugins for ESLint please check compatibility.

```diff
-    "@typescript-eslint/eslint-plugin": "^v4.33.0",
-    "@typescript-eslint/parser": "^v4.28.3",
+    "@typescript-eslint/eslint-plugin": "^5.9.0",
+    "@typescript-eslint/parser": "^5.9.0",
-    "eslint": "^7.30.0",
+    "eslint": "^8.6.0",
-    "eslint-plugin-import": "^2.20.2",
-    "eslint-plugin-jest": "^24.1.0",
-    "eslint-plugin-jsx-a11y": "^6.2.1",
+    "eslint-plugin-import": "^2.25.4",
+    "eslint-plugin-jest": "^25.3.4",
+    "eslint-plugin-jsx-a11y": "^6.5.1",
-    "eslint-plugin-react": "^7.12.4",
-    "eslint-plugin-react-hooks": "^4.0.0",
+    "eslint-plugin-react": "^7.28.0",
+    "eslint-plugin-react-hooks": "^4.3.0",
```

Please consult changelogs from packages if you find any problems.
