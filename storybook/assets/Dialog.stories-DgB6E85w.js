import{j as o}from"./jsx-runtime-CvpxdxdE.js";import{d as c}from"./Close-Ddy51yDY.js";import{D as l,a as m,b as d,c as y}from"./DialogTitle-4Ny0TCxB.js";import{m as h}from"./makeStyles-yUUo8jj4.js";import{I as g}from"./IconButton-Ckj9xv_i.js";import{T as t}from"./Typography-C4wK928C.js";import{B as i}from"./Button-CCF23O8k.js";import{c as u}from"./createStyles-Bp4GwXob.js";import"./index-DSHF18-l.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-Cq_PMNt4.js";import"./capitalize-Bw5a1ocu.js";import"./defaultTheme-DT8oR2d2.js";import"./withStyles-BYtY9EuN.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-boREoDcc.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-fiJl_Gvd.js";import"./ownerWindow-BCxlYCSn.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./index-DBvFAGNd.js";import"./useControlled-i6Pam0ca.js";import"./unstable_useId-BAMTp7ON.js";import"./Modal-DAP4GuSW.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-Dl07bpo2.js";import"./Backdrop-OqtEQ92n.js";import"./useTheme-DT5kHe_T.js";import"./utils-BnkjTVkr.js";import"./TransitionGroupContext-BUwkeBv7.js";import"./Paper-B3vUppvp.js";import"./ButtonBase-CsQ2zz2r.js";import"./createStyles-yD3y8ldD.js";const Z={title:"Layout/Dialog",component:l},x=h(e=>u({closeButton:{position:"absolute",right:e.spacing(1),top:e.spacing(1),color:e.palette.grey[500]}})),r={args:{open:!0},render:({open:e})=>{const p=x();return o.jsxs(l,{"aria-labelledby":"dialog-title","aria-describedby":"dialog-description",open:e,children:[o.jsxs(m,{id:"dialog-title",children:["Dialog Box Title",o.jsx(g,{"aria-label":"close",className:p.closeButton,children:o.jsx(c,{})})]}),o.jsxs(d,{children:[o.jsx(t,{children:"This component is used whenever confirmation of some sort is needed, such as:"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx(t,{children:"Consent to sensitive matters like GDPR, access, etc;"})}),o.jsx("li",{children:o.jsx(t,{children:"Save, submit, cancel after a form is completed;"})}),o.jsx("li",{children:o.jsx(t,{children:"Alert message;"})}),o.jsx("li",{children:o.jsx(t,{children:"Buttons are optional."})})]}),o.jsx(t,{children:"The color for the secondary button is the same as the primary."})]}),o.jsxs(y,{children:[o.jsx(i,{color:"primary",children:"Secondary action"}),o.jsx(i,{color:"primary",children:"Primary action"})]})]})}};var n,s,a;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
