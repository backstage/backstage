import{m as r,j as o,I as l,b as c,d as e}from"./iframe-B6vHPHUS.js";import{D as t,a as p,b as d,c as m}from"./DialogTitle-B91uUjY7.js";import{B as a}from"./Button-CJpRzj7y.js";import{c as y}from"./createStyles-Bp4GwXob.js";import"./preload-helper-D9Z9MdNV.js";import"./Modal-BadxeSQ1.js";import"./Portal-DQJrkvBY.js";import"./Backdrop-khO5dm31.js";import"./createStyles-yD3y8ldD.js";const C={title:"Layout/Dialog",component:t},h=r(n=>y({closeButton:{position:"absolute",right:n.spacing(1),top:n.spacing(1),color:n.palette.grey[500]}})),s={args:{open:!0},render:({open:n})=>{const i=h();return o.jsxs(t,{"aria-labelledby":"dialog-title","aria-describedby":"dialog-description",open:n,children:[o.jsxs(p,{id:"dialog-title",children:["Dialog Box Title",o.jsx(l,{"aria-label":"close",className:i.closeButton,children:o.jsx(c,{})})]}),o.jsxs(d,{children:[o.jsx(e,{children:"This component is used whenever confirmation of some sort is needed, such as:"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx(e,{children:"Consent to sensitive matters like GDPR, access, etc;"})}),o.jsx("li",{children:o.jsx(e,{children:"Save, submit, cancel after a form is completed;"})}),o.jsx("li",{children:o.jsx(e,{children:"Alert message;"})}),o.jsx("li",{children:o.jsx(e,{children:"Buttons are optional."})})]}),o.jsx(e,{children:"The color for the secondary button is the same as the primary."})]}),o.jsxs(m,{children:[o.jsx(a,{color:"primary",children:"Secondary action"}),o.jsx(a,{color:"primary",children:"Primary action"})]})]})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const S=["Default"];export{s as Default,S as __namedExportsOrder,C as default};
