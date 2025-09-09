import{j as e}from"./jsx-runtime-hv06LKfz.js";import{r as c}from"./index-D8-PC79C.js";import{C as u}from"./Close-BM4s232s.js";import{D as i}from"./Drawer-BATyy66a.js";import{m as p}from"./makeStyles-DNGcMHuZ.js";import{B as o}from"./Button-CEmE9XRa.js";import{c as l}from"./createStyles-Bp4GwXob.js";import{T as D}from"./Typography-BvnmTcFn.js";import{I as w}from"./IconButton-Bo_KmUI8.js";import"./createSvgIcon-968fIvf3.js";import"./capitalize-Cx0lXINv.js";import"./defaultTheme-BZ7Q3aB1.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-Bqo-niQy.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useTheme-CwtcVVC7.js";import"./Paper-g-2P_2fo.js";import"./utils--Do46zhV.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./Modal-Bc9WJ84x.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-yuzZovYw.js";import"./Backdrop-kT-O4MFe.js";import"./ButtonBase-C97Mu9vz.js";import"./createStyles-yD3y8ldD.js";const X={title:"Layout/Drawer",component:i},m=p(t=>l({paper:{width:"50%",justifyContent:"space-between",padding:t.spacing(2.5)}})),g=p(t=>l({header:{display:"flex",flexDirection:"row",justifyContent:"space-between"},icon:{fontSize:20},content:{height:"80%",backgroundColor:"#EEEEEE"},secondaryAction:{marginLeft:t.spacing(2.5)}})),d=({toggleDrawer:t})=>{const r=g();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:r.header,children:[e.jsx(D,{variant:"h5",children:"Side Panel Title"}),e.jsx(w,{title:"Close the drawer",onClick:()=>t(!1),color:"inherit",children:e.jsx(u,{className:r.icon})},"dismiss")]}),e.jsx("div",{className:r.content}),e.jsxs("div",{children:[e.jsx(o,{variant:"contained",color:"primary",onClick:()=>t(!1),children:"Primary Action"}),e.jsx(o,{className:r.secondaryAction,variant:"outlined",color:"primary",onClick:()=>t(!1),children:"Secondary Action"})]})]})},s=()=>{const[t,r]=c.useState(!1),a=m();return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Default Drawer"}),e.jsx(i,{classes:{paper:a.paper},anchor:"right",open:t,onClose:()=>r(!1),children:e.jsx(d,{toggleDrawer:r})})]})},n=()=>{const[t,r]=c.useState(!1),a=m();return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Persistent Drawer"}),e.jsx(i,{classes:{paper:a.paper},variant:"persistent",anchor:"right",open:t,onClose:()=>r(!1),children:e.jsx(d,{toggleDrawer:r})})]})};s.__docgenInfo={description:"",methods:[],displayName:"DefaultDrawer"};n.__docgenInfo={description:"",methods:[],displayName:"PersistentDrawer"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...n.parameters?.docs?.source}}};const Y=["DefaultDrawer","PersistentDrawer"];export{s as DefaultDrawer,n as PersistentDrawer,Y as __namedExportsOrder,X as default};
