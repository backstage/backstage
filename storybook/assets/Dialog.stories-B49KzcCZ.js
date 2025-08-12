import{j as o}from"./jsx-runtime-Cw0GR0a5.js";import{d as c}from"./Close-DEcsD6Oc.js";import{D as l,a as m,b as d,c as y}from"./DialogTitle-0X77V_w3.js";import{m as h}from"./makeStyles-3WuthtJ7.js";import{I as g}from"./IconButton-BxJ-nFiT.js";import{T as t}from"./Typography-CUBppVl0.js";import{B as i}from"./Button-Cwg5hjTf.js";import{c as u}from"./createStyles-Bp4GwXob.js";import"./index-CTjT7uj6.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-rCELOQ8q.js";import"./capitalize-CjHL08xv.js";import"./defaultTheme-U8IXQtr7.js";import"./withStyles-Dj_puyu8.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CAWH9WqG.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./index-DwHHXP4W.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./Modal-CkYXz1UB.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-BcgI5KAA.js";import"./Backdrop-4VNCEbNz.js";import"./useTheme-hfNS2WFw.js";import"./utils-ClB-4IsE.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./Paper-BZKq1osr.js";import"./ButtonBase-C1iu_4vV.js";import"./createStyles-yD3y8ldD.js";const Z={title:"Layout/Dialog",component:l},x=h(e=>u({closeButton:{position:"absolute",right:e.spacing(1),top:e.spacing(1),color:e.palette.grey[500]}})),r={args:{open:!0},render:({open:e})=>{const p=x();return o.jsxs(l,{"aria-labelledby":"dialog-title","aria-describedby":"dialog-description",open:e,children:[o.jsxs(m,{id:"dialog-title",children:["Dialog Box Title",o.jsx(g,{"aria-label":"close",className:p.closeButton,children:o.jsx(c,{})})]}),o.jsxs(d,{children:[o.jsx(t,{children:"This component is used whenever confirmation of some sort is needed, such as:"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx(t,{children:"Consent to sensitive matters like GDPR, access, etc;"})}),o.jsx("li",{children:o.jsx(t,{children:"Save, submit, cancel after a form is completed;"})}),o.jsx("li",{children:o.jsx(t,{children:"Alert message;"})}),o.jsx("li",{children:o.jsx(t,{children:"Buttons are optional."})})]}),o.jsx(t,{children:"The color for the secondary button is the same as the primary."})]}),o.jsxs(y,{children:[o.jsx(i,{color:"primary",children:"Secondary action"}),o.jsx(i,{color:"primary",children:"Primary action"})]})]})}};var n,s,a;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
}`,...(a=(s=r.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const $=["Default"];export{r as Default,$ as __namedExportsOrder,Z as default};
