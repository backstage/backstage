import{j as o,K as r,X as l,d as e}from"./iframe-DBsVXRYe.js";import{c as s,D as c,a as p,b as y}from"./DialogTitle-B0gHk9e8.js";import{m as d}from"./makeStyles-u8aTytdp.js";import{B as t}from"./Button-BsyXmJi_.js";import{c as m}from"./createStyles-Bp4GwXob.js";import"./preload-helper-PPVm8Dsz.js";import"./Modal-Ds3oc-YR.js";import"./Portal-9OHpjUEk.js";import"./Backdrop-DJPRpi6t.js";import"./createStyles-yD3y8ldD.js";const v={title:"Layout/Dialog",component:s,tags:["!manifest"]},g=d(a=>m({closeButton:{position:"absolute",right:a.spacing(1),top:a.spacing(1),color:a.palette.grey[500]}})),n={args:{open:!0},render:({open:a})=>{const i=g();return o.jsxs(s,{"aria-labelledby":"dialog-title","aria-describedby":"dialog-description",open:a,children:[o.jsxs(c,{id:"dialog-title",children:["Dialog Box Title",o.jsx(r,{"aria-label":"close",className:i.closeButton,children:o.jsx(l,{})})]}),o.jsxs(p,{children:[o.jsx(e,{children:"This component is used whenever confirmation of some sort is needed, such as:"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx(e,{children:"Consent to sensitive matters like GDPR, access, etc;"})}),o.jsx("li",{children:o.jsx(e,{children:"Save, submit, cancel after a form is completed;"})}),o.jsx("li",{children:o.jsx(e,{children:"Alert message;"})}),o.jsx("li",{children:o.jsx(e,{children:"Buttons are optional."})})]}),o.jsx(e,{children:"The color for the secondary button is the same as the primary."})]}),o.jsxs(y,{children:[o.jsx(t,{color:"primary",children:"Secondary action"}),o.jsx(t,{color:"primary",children:"Primary action"})]})]})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const Default = ({ open }: { open: boolean }) => {
  const classes = styles();

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={open}
    >
      <DialogTitle id="dialog-title">
        Dialog Box Title
        <IconButton aria-label="close" className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          This component is used whenever confirmation of some sort is needed,
          such as:
        </Typography>
        <ul>
          <li>
            <Typography>
              Consent to sensitive matters like GDPR, access, etc;
            </Typography>
          </li>
          <li>
            <Typography>
              Save, submit, cancel after a form is completed;
            </Typography>
          </li>
          <li>
            <Typography>Alert message;</Typography>
          </li>
          <li>
            <Typography>Buttons are optional.</Typography>
          </li>
        </ul>
        <Typography>
          The color for the secondary button is the same as the primary.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary">Secondary action</Button>
        <Button color="primary">Primary action</Button>
      </DialogActions>
    </Dialog>
  );
};
`,...n.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    open: true
  },
  render: ({
    open
  }: {
    open: boolean;
  }) => {
    const classes = styles();
    return <Dialog aria-labelledby="dialog-title" aria-describedby="dialog-description" open={open}>
        <DialogTitle id="dialog-title">
          Dialog Box Title
          <IconButton aria-label="close" className={classes.closeButton}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>
            This component is used whenever confirmation of some sort is needed,
            such as:
          </Typography>
          <ul>
            <li>
              <Typography>
                Consent to sensitive matters like GDPR, access, etc;
              </Typography>
            </li>
            <li>
              <Typography>
                Save, submit, cancel after a form is completed;
              </Typography>
            </li>
            <li>
              <Typography>Alert message;</Typography>
            </li>
            <li>
              <Typography>Buttons are optional.</Typography>
            </li>
          </ul>
          <Typography>
            The color for the secondary button is the same as the primary.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary">Secondary action</Button>
          <Button color="primary">Primary action</Button>
        </DialogActions>
      </Dialog>;
  }
}`,...n.parameters?.docs?.source}}};const S=["Default"];export{n as Default,S as __namedExportsOrder,v as default};
