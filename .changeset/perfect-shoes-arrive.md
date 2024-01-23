---
'@backstage/plugin-entity-feedback': minor
'@backstage/plugin-entity-feedback-backend': patch
---

<!-- @backstage/plugin-entity-feedback -->

Add in logic to require comments for specific feedback responses
const overviewContent = (
<Grid container spacing={3} alignItems="stretch">
...

- <Grid item md={2}>
-     <InfoCard title="Rate this entity">
-       <LikeDislikeButtons
-         feedbackDialogResponses = {[
-          { id: 'incorrect', label: 'Incorrect info' },
-          { id: 'missing', label: 'Missing info', mustComment: true },
-          { id: 'other', label: 'Other (please specify below)', mustComment: true },
-         ]}
-       />
-     </InfoCard>
- </Grid>
        ...
      </Grid>
    );
  <!-- @backstage/plugin-entity-feedback-backend -->
  Add in description for 400 response when rating and not authenticated
