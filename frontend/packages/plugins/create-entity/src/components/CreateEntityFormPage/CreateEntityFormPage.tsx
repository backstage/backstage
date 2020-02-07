import React, { Fragment } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useFormik } from 'formik';
import { Button, TextField, makeStyles } from '@material-ui/core';
import { InfoCard } from '@backstage/core';

const useStyles = makeStyles(theme => ({
  formGroup: {
    padding: '10px',
  },
}));

const CreateEntityFormPage = () => {
  const classes = useStyles();
  const match = useRouteMatch<{ templateId: string }>();
  const templateId = decodeURIComponent(match.params.templateId);

  const formik = useFormik({
    initialValues: {
      entityId: '',
      description: '',
    },
    onSubmit: (values: any) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Fragment>
      <InfoCard title={`Create New ${templateId}`}>
        <form onSubmit={formik.handleSubmit}>
          <div className={classes.formGroup}>
            <TextField
              label="Entity Id:"
              name="entity-id"
              id="entity-id"
              value={formik.values.entityId}
              variant="outlined"
            ></TextField>
          </div>
          <div className={classes.formGroup}>
            <TextField
              label="Description:"
              name="description"
              id="description"
              value={formik.values.description}
              variant="outlined"
            ></TextField>
          </div>
          <div className={classes.formGroup}>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </InfoCard>
    </Fragment>
  );
};

export default CreateEntityFormPage;
