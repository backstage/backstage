import{j as e}from"./jsx-runtime-Cw0GR0a5.js";import{r as D}from"./index-CTjT7uj6.js";import{d as x}from"./Close-DEcsD6Oc.js";import{D as i}from"./Drawer-BdsgLdJL.js";import{m as w}from"./makeStyles-3WuthtJ7.js";import{B as n}from"./Button-Cwg5hjTf.js";import{c as g}from"./createStyles-Bp4GwXob.js";import{T as y}from"./Typography-CUBppVl0.js";import{I as j}from"./IconButton-BxJ-nFiT.js";import"./interopRequireDefault-Y9pwbXtE.js";import"./createSvgIcon-rCELOQ8q.js";import"./capitalize-CjHL08xv.js";import"./defaultTheme-U8IXQtr7.js";import"./withStyles-Dj_puyu8.js";import"./hoist-non-react-statics.cjs-DzIEFHQI.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-CAWH9WqG.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-B_4ddUuK.js";import"./ownerWindow-C3iVrxHF.js";import"./useIsFocusVisible-BQk2_Vhe.js";import"./index-DwHHXP4W.js";import"./useControlled-B47E2WMp.js";import"./unstable_useId-B3Hiq1YI.js";import"./useTheme-hfNS2WFw.js";import"./Paper-BZKq1osr.js";import"./Modal-CkYXz1UB.js";import"./classCallCheck-BNzALLS0.js";import"./Portal-BcgI5KAA.js";import"./Backdrop-4VNCEbNz.js";import"./utils-ClB-4IsE.js";import"./TransitionGroupContext-BtzQ-Cv7.js";import"./ButtonBase-C1iu_4vV.js";import"./createStyles-yD3y8ldD.js";const se={title:"Layout/Drawer",component:i},f=w(t=>g({paper:{width:"50%",justifyContent:"space-between",padding:t.spacing(2.5)}})),C=w(t=>g({header:{display:"flex",flexDirection:"row",justifyContent:"space-between"},icon:{fontSize:20},content:{height:"80%",backgroundColor:"#EEEEEE"},secondaryAction:{marginLeft:t.spacing(2.5)}})),h=({toggleDrawer:t})=>{const r=C();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:r.header,children:[e.jsx(y,{variant:"h5",children:"Side Panel Title"}),e.jsx(j,{title:"Close the drawer",onClick:()=>t(!1),color:"inherit",children:e.jsx(x,{className:r.icon})},"dismiss")]}),e.jsx("div",{className:r.content}),e.jsxs("div",{children:[e.jsx(n,{variant:"contained",color:"primary",onClick:()=>t(!1),children:"Primary Action"}),e.jsx(n,{className:r.secondaryAction,variant:"outlined",color:"primary",onClick:()=>t(!1),children:"Secondary Action"})]})]})},s=()=>{const[t,r]=D.useState(!1),o=f();return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Default Drawer"}),e.jsx(i,{classes:{paper:o.paper},anchor:"right",open:t,onClose:()=>r(!1),children:e.jsx(h,{toggleDrawer:r})})]})},a=()=>{const[t,r]=D.useState(!1),o=f();return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Persistent Drawer"}),e.jsx(i,{classes:{paper:o.paper},variant:"persistent",anchor:"right",open:t,onClose:()=>r(!1),children:e.jsx(h,{toggleDrawer:r})})]})};s.__docgenInfo={description:"",methods:[],displayName:"DefaultDrawer"};a.__docgenInfo={description:"",methods:[],displayName:"PersistentDrawer"};var c,p,l;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`() => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();
  return <>
      <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
        Open Default Drawer
      </Button>
      <Drawer classes={{
      paper: classes.paper
    }} anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>;
}`,...(l=(p=s.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var m,d,u;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`() => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();
  return <>
      <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
        Open Persistent Drawer
      </Button>
      <Drawer classes={{
      paper: classes.paper
    }} variant="persistent" anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>;
}`,...(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};const ae=["DefaultDrawer","PersistentDrawer"];export{s as DefaultDrawer,a as PersistentDrawer,ae as __namedExportsOrder,se as default};
