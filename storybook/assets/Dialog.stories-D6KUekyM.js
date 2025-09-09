import{j as o}from"./jsx-runtime-hv06LKfz.js";import{C as a}from"./Close-BM4s232s.js";import{D as n,a as l,b as p,c}from"./DialogTitle-C--IyUdw.js";import{m}from"./makeStyles-DNGcMHuZ.js";import{I as d}from"./IconButton-Bo_KmUI8.js";import{T as e}from"./Typography-BvnmTcFn.js";import{B as i}from"./Button-CEmE9XRa.js";import{c as y}from"./createStyles-Bp4GwXob.js";import"./index-D8-PC79C.js";import"./createSvgIcon-968fIvf3.js";import"./capitalize-Cx0lXINv.js";import"./defaultTheme-BZ7Q3aB1.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-Bqo-niQy.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./Modal-Bc9WJ84x.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-yuzZovYw.js";import"./Backdrop-kT-O4MFe.js";import"./useTheme-CwtcVVC7.js";import"./utils--Do46zhV.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./Paper-g-2P_2fo.js";import"./ButtonBase-C97Mu9vz.js";import"./createStyles-yD3y8ldD.js";const V={title:"Layout/Dialog",component:n},h=m(t=>y({closeButton:{position:"absolute",right:t.spacing(1),top:t.spacing(1),color:t.palette.grey[500]}})),r={args:{open:!0},render:({open:t})=>{const s=h();return o.jsxs(n,{"aria-labelledby":"dialog-title","aria-describedby":"dialog-description",open:t,children:[o.jsxs(l,{id:"dialog-title",children:["Dialog Box Title",o.jsx(d,{"aria-label":"close",className:s.closeButton,children:o.jsx(a,{})})]}),o.jsxs(p,{children:[o.jsx(e,{children:"This component is used whenever confirmation of some sort is needed, such as:"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx(e,{children:"Consent to sensitive matters like GDPR, access, etc;"})}),o.jsx("li",{children:o.jsx(e,{children:"Save, submit, cancel after a form is completed;"})}),o.jsx("li",{children:o.jsx(e,{children:"Alert message;"})}),o.jsx("li",{children:o.jsx(e,{children:"Buttons are optional."})})]}),o.jsx(e,{children:"The color for the secondary button is the same as the primary."})]}),o.jsxs(c,{children:[o.jsx(i,{color:"primary",children:"Secondary action"}),o.jsx(i,{color:"primary",children:"Primary action"})]})]})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const W=["Default"];export{r as Default,W as __namedExportsOrder,V as default};
