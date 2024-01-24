---
'@backstage/plugin-entity-feedback': minor
'@backstage/plugin-entity-feedback-backend': patch
---

<!-- @backstage/plugin-entity-feedback -->

Add in logic to link the feedback comment box to specific feedback responses
const requireComments = (
<Grid container spacing={3} alignItems="stretch">
...
<LikeDislikeButtons

- feedbackDialogResponses = {[
- { id: 'incorrect', label: 'Incorrect info' },
- { id: 'missing', label: 'Missing info', `mustComment`: true },
- { id: 'other', label: 'Other (please specify below)', `mustComment`: true },
- ]}
- />
  ...
  </Grid>
  );

<!-- @backstage/plugin-entity-feedback-backend -->

Add in description for 400 response when rating and not authenticated
