import{j as o}from"./jsx-runtime-CvpxdxdE.js";import{d as c}from"./Close-BTzfFecM.js";import{D as l,a as m,b as d,c as y}from"./DialogTitle-Cc5mYfe_.js";import{m as h}from"./makeStyles-BIagdtUJ.js";import{I as g}from"./IconButton-Bhqd37kB.js";import{T as t}from"./Typography-Bm-N-dvv.js";import{B as i}from"./Button-C2638_Vj.js";import{c as u}from"./createStyles-Bp4GwXob.js";import"./index-DSHF18-l.js";import"./typeof-jYoadTod.js";import"./createSvgIcon-5qk-fEpi.js";import"./capitalize-CAo0_JGt.js";import"./defaultTheme-cHLKSkOs.js";import"./withStyles-CiJb2SGb.js";import"./hoist-non-react-statics.cjs-DlMN-SZi.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-QzyO_PdA.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-fiJl_Gvd.js";import"./ownerWindow-BCxlYCSn.js";import"./useIsFocusVisible-Sgmp0f7s.js";import"./index-DBvFAGNd.js";import"./useControlled-i6Pam0ca.js";import"./unstable_useId-BAMTp7ON.js";import"./Modal-DeG-yW_3.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-Dl07bpo2.js";import"./Backdrop-BiW-9YPm.js";import"./useTheme-ChDSp8cY.js";import"./utils-BuZ5BtGr.js";import"./TransitionGroupContext-BUwkeBv7.js";import"./Paper-CETy80Mm.js";import"./ButtonBase-obR2bX8B.js";import"./createStyles-yD3y8ldD.js";const Z={title:"Layout/Dialog",component:l},x=h(e=>u({closeButton:{position:"absolute",right:e.spacing(1),top:e.spacing(1),color:e.palette.grey[500]}})),r={args:{open:!0},render:({open:e})=>{const p=x();return o.jsxs(l,{"aria-labelledby":"dialog-title","aria-describedby":"dialog-description",open:e,children:[o.jsxs(m,{id:"dialog-title",children:["Dialog Box Title",o.jsx(g,{"aria-label":"close",className:p.closeButton,children:o.jsx(c,{})})]}),o.jsxs(d,{children:[o.jsx(t,{children:"This component is used whenever confirmation of some sort is needed, such as:"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx(t,{children:"Consent to sensitive matters like GDPR, access, etc;"})}),o.jsx("li",{children:o.jsx(t,{children:"Save, submit, cancel after a form is completed;"})}),o.jsx("li",{children:o.jsx(t,{children:"Alert message;"})}),o.jsx("li",{children:o.jsx(t,{children:"Buttons are optional."})})]}),o.jsx(t,{children:"The color for the secondary button is the same as the primary."})]}),o.jsxs(y,{children:[o.jsx(i,{color:"primary",children:"Secondary action"}),o.jsx(i,{color:"primary",children:"Primary action"})]})]})}};var n,s,a;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
