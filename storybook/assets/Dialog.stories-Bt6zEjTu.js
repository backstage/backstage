import{j as o}from"./jsx-runtime-hv06LKfz.js";import{C as a}from"./Close-Rhx9yaiC.js";import{D as n,a as l,b as p,c}from"./DialogTitle-o0dzZRby.js";import{m}from"./makeStyles-CJp8qHqH.js";import{I as d}from"./IconButton-tgA3biVt.js";import{T as t}from"./Typography-NhBf-tfS.js";import{B as i}from"./Button-aFPoPc-s.js";import{c as y}from"./createStyles-Bp4GwXob.js";import"./index-D8-PC79C.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./capitalize-fS9uM6tv.js";import"./defaultTheme-NkpNA350.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./Modal-m69wb1rs.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-yuzZovYw.js";import"./Backdrop-DJnqAxx3.js";import"./useTheme-Dk0AiudM.js";import"./utils-DMni-BWz.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./Paper-BiLxp0Cg.js";import"./ButtonBase-DXo3xcpP.js";import"./createStyles-yD3y8ldD.js";const X={title:"Layout/Dialog",component:n},h=m(e=>y({closeButton:{position:"absolute",right:e.spacing(1),top:e.spacing(1),color:e.palette.grey[500]}})),r={args:{open:!0},render:({open:e})=>{const s=h();return o.jsxs(n,{"aria-labelledby":"dialog-title","aria-describedby":"dialog-description",open:e,children:[o.jsxs(l,{id:"dialog-title",children:["Dialog Box Title",o.jsx(d,{"aria-label":"close",className:s.closeButton,children:o.jsx(a,{})})]}),o.jsxs(p,{children:[o.jsx(t,{children:"This component is used whenever confirmation of some sort is needed, such as:"}),o.jsxs("ul",{children:[o.jsx("li",{children:o.jsx(t,{children:"Consent to sensitive matters like GDPR, access, etc;"})}),o.jsx("li",{children:o.jsx(t,{children:"Save, submit, cancel after a form is completed;"})}),o.jsx("li",{children:o.jsx(t,{children:"Alert message;"})}),o.jsx("li",{children:o.jsx(t,{children:"Buttons are optional."})})]}),o.jsx(t,{children:"The color for the secondary button is the same as the primary."})]}),o.jsxs(c,{children:[o.jsx(i,{color:"primary",children:"Secondary action"}),o.jsx(i,{color:"primary",children:"Primary action"})]})]})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const Y=["Default"];export{r as Default,Y as __namedExportsOrder,X as default};
