import React, { Fragment } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useFormik } from 'formik';
import { Button, TextField, makeStyles } from '@material-ui/core';
import { InfoCard } from '@backstage/core';
import { scaffolderV1 } from '@backstage/protobuf-definitions';

const useStyles = makeStyles(theme => ({
  formGroup: {
    padding: theme.spacing(2),
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
      console.log(JSON.stringify(values, null, 2));
      const client = new scaffolderV1.Client('http://localhost:8080');
      const req = new scaffolderV1.CreateRequest();
      req.setComponentId(values.entityId);
      req.setTemplateId(templateId);
      // req.setOrg('soapraj');
      req.setPrivate(false);
      client.create(req).then((res: scaffolderV1.CreateReply) => {
        console.log('COMPONENT CREATED');
        console.log(res.toObject().componentId);
      });
    }
  });

  return (
    <Fragment>
      <InfoCard title={`Create New ${templateId}`}>
        <form onSubmit={formik.handleSubmit}>
          <div className={classes.formGroup}>
            <TextField
              label="Entity Id:"
              name="entityId"
              id="entityId"
              onChange={formik.handleChange}
              variant="outlined"
            ></TextField>
          </div>
          <div className={classes.formGroup}>
            <TextField
              label="Description:"
              name="description"
              id="description"
              onChange={formik.handleChange}
              variant="outlined"
            ></TextField>
          </div>
          <div className={classes.formGroup}>
            <Button variant="contained" color="primary" onClick={formik.submitForm}>
              Submit
            </Button>
          </div>
        </form>
      </InfoCard>
    </Fragment>
  );
};

export default CreateEntityFormPage;
