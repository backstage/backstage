import{j as r}from"./jsx-runtime-hv06LKfz.js";import{r as c}from"./index-D8-PC79C.js";import{C as u}from"./Close-Rhx9yaiC.js";import{D as i}from"./Drawer-N3PAsgX-.js";import{m as p}from"./makeStyles-CJp8qHqH.js";import{B as n}from"./Button-aFPoPc-s.js";import{c as l}from"./createStyles-Bp4GwXob.js";import{T as D}from"./Typography-NhBf-tfS.js";import{I as w}from"./IconButton-tgA3biVt.js";import"./typeof-ZI2KZN5z.js";import"./createSvgIcon-Bpme_iea.js";import"./capitalize-fS9uM6tv.js";import"./defaultTheme-NkpNA350.js";import"./withStyles-BsQ9H3bp.js";import"./hoist-non-react-statics.cjs-DtcWCWp5.js";import"./createChainedFunction-Da-WpsAN.js";import"./createSvgIcon-D-gz-Nq7.js";import"./debounce-DtXjJkxj.js";import"./isMuiElement-DKhW5xVU.js";import"./ownerWindow-CjzjL4wv.js";import"./useIsFocusVisible-BFy7UoKA.js";import"./index-DXvUqTe6.js";import"./index-BITTEREo.js";import"./useControlled-CliGfT3L.js";import"./unstable_useId-DQJte0g1.js";import"./useTheme-Dk0AiudM.js";import"./Paper-BiLxp0Cg.js";import"./utils-DMni-BWz.js";import"./TransitionGroupContext-CcnbR2YJ.js";import"./Modal-m69wb1rs.js";import"./classCallCheck-MFKM5G8b.js";import"./Portal-yuzZovYw.js";import"./Backdrop-DJnqAxx3.js";import"./ButtonBase-DXo3xcpP.js";import"./createStyles-yD3y8ldD.js";const Z={title:"Layout/Drawer",component:i},m=p(t=>l({paper:{width:"50%",justifyContent:"space-between",padding:t.spacing(2.5)}})),g=p(t=>l({header:{display:"flex",flexDirection:"row",justifyContent:"space-between"},icon:{fontSize:20},content:{height:"80%",backgroundColor:"#EEEEEE"},secondaryAction:{marginLeft:t.spacing(2.5)}})),d=({toggleDrawer:t})=>{const e=g();return r.jsxs(r.Fragment,{children:[r.jsxs("div",{className:e.header,children:[r.jsx(D,{variant:"h5",children:"Side Panel Title"}),r.jsx(w,{title:"Close the drawer",onClick:()=>t(!1),color:"inherit",children:r.jsx(u,{className:e.icon})},"dismiss")]}),r.jsx("div",{className:e.content}),r.jsxs("div",{children:[r.jsx(n,{variant:"contained",color:"primary",onClick:()=>t(!1),children:"Primary Action"}),r.jsx(n,{className:e.secondaryAction,variant:"outlined",color:"primary",onClick:()=>t(!1),children:"Secondary Action"})]})]})},s=()=>{const[t,e]=c.useState(!1),a=m();return r.jsxs(r.Fragment,{children:[r.jsx(n,{variant:"contained",color:"primary",onClick:()=>e(!0),children:"Open Default Drawer"}),r.jsx(i,{classes:{paper:a.paper},anchor:"right",open:t,onClose:()=>e(!1),children:r.jsx(d,{toggleDrawer:e})})]})},o=()=>{const[t,e]=c.useState(!1),a=m();return r.jsxs(r.Fragment,{children:[r.jsx(n,{variant:"contained",color:"primary",onClick:()=>e(!0),children:"Open Persistent Drawer"}),r.jsx(i,{classes:{paper:a.paper},variant:"persistent",anchor:"right",open:t,onClose:()=>e(!1),children:r.jsx(d,{toggleDrawer:e})})]})};s.__docgenInfo={description:"",methods:[],displayName:"DefaultDrawer"};o.__docgenInfo={description:"",methods:[],displayName:"PersistentDrawer"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
}`,...o.parameters?.docs?.source}}};const $=["DefaultDrawer","PersistentDrawer"];export{s as DefaultDrawer,o as PersistentDrawer,$ as __namedExportsOrder,Z as default};
