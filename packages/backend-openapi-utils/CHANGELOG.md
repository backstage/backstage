# @backstage/backend-openapi-utils

## 0.0.2-next.0

### Patch Changes

- 27956d78671: Adjusted README accordingly after the generated output now has a `.generated.ts` extension

## 0.0.1

### Patch Changes

- 62fe726fdc5: New plugin! Primary focus is to support types on `Router`s in backend packages. Developers can use the `ApiRouter` from this package in their packages to support a typed experience based on their OpenAPI specs. The `ApiRouter` supports request bodies, response bodies, query parameters and path parameters, as well as full path-based context of the above. This means no more guessing on an endpoint like `req.post('/not-my-route', (req, res)=>{res.send(req.body.badparam)})`. Typescript would catch `/not-my-route`, `req.body.badparam`, `res.send(req.body.badparam)`.

## 0.0.1-next.0

### Patch Changes

- 62fe726fdc5: New plugin! Primary focus is to support types on `Router`s in backend packages. Developers can use the `ApiRouter` from this package in their packages to support a typed experience based on their OpenAPI specs. The `ApiRouter` supports request bodies, response bodies, query parameters and path parameters, as well as full path-based context of the above. This means no more guessing on an endpoint like `req.post('/not-my-route', (req, res)=>{res.send(req.body.badparam)})`. Typescript would catch `/not-my-route`, `req.body.badparam`, `res.send(req.body.badparam)`.
