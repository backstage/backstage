import{j as o,O as r,Y as l,I as e}from"./iframe-T196ztmH.js";import{c as a,D as c,a as p,b as d}from"./DialogTitle-Th61xBML.js";import{B as t}from"./Button-Bg7hei9L.js";import{m}from"./makeStyles-wXls5oBk.js";import{c as y}from"./createStyles-Bp4GwXob.js";import"./preload-helper-PPVm8Dsz.js";import"./Modal-B-hnEzn3.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-DwZNXahi.js";import"./Backdrop-j2JAuBUm.js";import"./createStyles-yD3y8ldD.js";const v={title:"Layout/Dialog",component:a,tags:["!manifest"]},g=m(n=>y({closeButton:{position:"absolute",right:n.spacing(1),top:n.spacing(1),color:n.palette.grey[500]}})),s={args:{open:!0},render:({open:n})=>{const i=g();return o.jsxs(a,{"aria-labelledby":"dialog-title","aria-describedby":"dialog-description",open:n,children:[o.jsxs(c,{id:"dialog-title",children:["Dialog Box Title",o.jsx(r,{"aria-label":"close",className:i.closeButton,children:o.jsx(l,{})})]}),o.jsxs(p,{children:[o.jsx(e,{children:"This component is used whenever confirmation of some sort is needed, such as:"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx(e,{children:"Consent to sensitive matters like GDPR, access, etc;"})}),o.jsx("li",{children:o.jsx(e,{children:"Save, submit, cancel after a form is completed;"})}),o.jsx("li",{children:o.jsx(e,{children:"Alert message;"})}),o.jsx("li",{children:o.jsx(e,{children:"Buttons are optional."})})]}),o.jsx(e,{children:"The color for the secondary button is the same as the primary."})]}),o.jsxs(d,{children:[o.jsx(t,{color:"primary",children:"Secondary action"}),o.jsx(t,{color:"primary",children:"Primary action"})]})]})}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const A=["Default"];export{s as Default,A as __namedExportsOrder,v as default};
