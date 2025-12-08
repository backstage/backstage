import{r as c,m as l,j as e,d as u,I as D,b as w}from"./iframe-CA0Xqitl.js";import{D as i}from"./Drawer-DavSRk3I.js";import{B as t}from"./Button-CbaUxuKj.js";import{c as p}from"./createStyles-Bp4GwXob.js";import"./preload-helper-PPVm8Dsz.js";import"./Modal-CxVdZ6wB.js";import"./Portal-DUJxNLzx.js";import"./Backdrop-Cdn7d1XZ.js";import"./createStyles-yD3y8ldD.js";const k={title:"Layout/Drawer",component:i},d=l(s=>p({paper:{width:"50%",justifyContent:"space-between",padding:s.spacing(2.5)}})),g=l(s=>p({header:{display:"flex",flexDirection:"row",justifyContent:"space-between"},icon:{fontSize:20},content:{height:"80%",backgroundColor:"#EEEEEE"},secondaryAction:{marginLeft:s.spacing(2.5)}})),m=({toggleDrawer:s})=>{const r=g();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:r.header,children:[e.jsx(u,{variant:"h5",children:"Side Panel Title"}),e.jsx(D,{title:"Close the drawer",onClick:()=>s(!1),color:"inherit",children:e.jsx(w,{className:r.icon})},"dismiss")]}),e.jsx("div",{className:r.content}),e.jsxs("div",{children:[e.jsx(t,{variant:"contained",color:"primary",onClick:()=>s(!1),children:"Primary Action"}),e.jsx(t,{className:r.secondaryAction,variant:"outlined",color:"primary",onClick:()=>s(!1),children:"Secondary Action"})]})]})},n=()=>{const[s,r]=c.useState(!1),o=d();return e.jsxs(e.Fragment,{children:[e.jsx(t,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Default Drawer"}),e.jsx(i,{classes:{paper:o.paper},anchor:"right",open:s,onClose:()=>r(!1),children:e.jsx(m,{toggleDrawer:r})})]})},a=()=>{const[s,r]=c.useState(!1),o=d();return e.jsxs(e.Fragment,{children:[e.jsx(t,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Persistent Drawer"}),e.jsx(i,{classes:{paper:o.paper},variant:"persistent",anchor:"right",open:s,onClose:()=>r(!1),children:e.jsx(m,{toggleDrawer:r})})]})};n.__docgenInfo={description:"",methods:[],displayName:"DefaultDrawer"};a.__docgenInfo={description:"",methods:[],displayName:"PersistentDrawer"};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};const E=["DefaultDrawer","PersistentDrawer"];export{n as DefaultDrawer,a as PersistentDrawer,E as __namedExportsOrder,k as default};
